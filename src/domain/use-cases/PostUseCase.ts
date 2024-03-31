import { validString } from "@plugins/validString";
import { IPostRepository } from "../interfaces/post/IPostRepository";
import { Errors } from "@plugins/errors";
import { boolify } from "@plugins/boolify";
import { parseTags } from "@plugins/parseTags";
import { ISubscriptionTierRepository } from "@domain/interfaces/subscriptionTier/ISubscriptionTierRepository";
import { PrismaUseCase } from "./PrismaUseCase";
import { paginate } from "@plugins/paginate";
import { ImageType, Storage } from "@plugins/storage";
import { MediaType } from "@prisma/client";
import { numify } from "@plugins/numify";

export class PostUseCase {
    constructor(private postRepository: IPostRepository, private SubscriptionTierRepository: ISubscriptionTierRepository, private readonly db: PrismaUseCase, private readonly storage: Storage) { }

    async createPost(request: any): Promise<any> {
        if (validString(request.title)) throw Errors.MISSING_TITLE()
        if (validString(request.text)) throw Errors.MISSING_TEXT()
        if (validString(request.tags)) throw Errors.MISSING_TAGS()
        if (validString(request.media)) throw Errors.MISSING_MEDIA()
        request.nsfw = boolify(request.nsfw)
        const tags = parseTags(request.tags.trim())
        if (!tags) throw Errors.INVALID_TAGS()
        request.minTierId = validString(request.minTierId)
        const otherAuthorIds = request.otherAuthorIds?.map(id => ({ id }))
        request.otherAuthorIds = otherAuthorIds
        return this.postRepository.create(request);
    }

    async getPostById(request: any): Promise<any> {
        const post = await this.postRepository.getById(request);

        if (!post) throw Errors.NOT_FOUND()
        if (!request.user) throw Errors.UNAUTHORIZED()
        if (post.minTier && post.minTier.price.greaterThan(0)) {
            const userTier = await this.SubscriptionTierRepository.getById({ id: post.author[0].id, userId: request.user.id })
            if (!userTier) throw Errors.BAD_REQUEST()
            if (userTier?.price.lessThan(post.minTier.price)) throw Errors.LOW_TIER()
        }
        const [likes, dislikes, views, myVote] = await this.db.$transaction([
            this.db.votes.count({
                where: { postId: post.id, vote: 1 }
            }),
            this.db.votes.count({
                where: { postId: post.id, vote: -1 }
            }),
            this.db.votes.count({
                where: { postId: post.id },
            }),
            this.db.votes.findFirst({
                where: { postId: post.id, userId: request.user?.id ?? '' }
            })
        ])
        return {
            title: post.title,
            text: post.text,
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
            thumbUrl: post.thumbUrl ?? undefined,
            meta: {
                nsfw: post.nsfw,
                tags: post.tags,
                minTier: post.minTier ? {
                    id: post.minTier.id,
                    name: post.minTier.name,
                    price: post.minTier.price.toNumber(),
                } : undefined,
                authors: [post.authors[0]],
                likes: likes ?? 0,
                dislikes: dislikes ?? 0,
                views: views ?? 0,
                myVote: myVote?.vote ?? 0,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            }
        }
    }
    async getAllPosts(request: any): Promise<any> {
        if (request.user && request.userTierId) {
            const userTier = await this.SubscriptionTierRepository.getById({ id: request.userTierId, userId: request.user.id })
            if (!userTier) throw Errors.INVALID_TIER()
            const { price: userTierValue } = userTier
            const offset = (+request.page - 1) * +request.size
            const authorsCheck = request.creatorId && request.creatorId.trim().length > 0 ? { some: { id: request.creatorId } } : undefined
            const where: any = {
                authors: authorsCheck,
                OR: [
                    { minTier: { price: { lte: userTierValue } } },
                    { minTier: null },
                ],
                AND: [
                    {
                        OR: [

                        ]
                    }
                ]
            }
            if (request.titleSearch) {
                const words = request.titleSearch.split(' ').map(wd => wd.trim())
                words.forEach((word) => {
                    where.AND[0].OR.push({ title: { contains: word, mode: 'insensitive' } })
                })
            }
            let orderBy: unknown
            switch (request.sortBy) {
                case 'low-views':
                    orderBy = { votes: { _count: 'asc' } }
                    break
                case 'high-views':
                    orderBy = { votes: { _count: 'desc' } }
                    break
                case 'oldest':
                    orderBy = { createdAt: 'asc' }
                    break
                case 'newest':
                    orderBy = { createdAt: 'desc' }
                    break
                default:
                    throw Errors.INVALID_SORT()
            }

            request = { ...request, where, orderBy, offset }

            const [posts, total] = this.postRepository.getAll(request)


            return paginate(total, +request.page, offset, +request.size, posts.map(post => ({
                id: post.id,
                title: post.title,
                text: post.text,
                mediaUrl: post.mediaUrl,
                mediaType: post.mediaType,
                thumbUrl: post.thumbUrl ?? undefined,
                meta: {
                    width: post.thumbnailWidth ?? undefined,
                    height: post.thumbnailHeight ?? undefined,
                    nsfw: post.nsfw,
                    tags: post.tags,
                    authors: post.authors,
                    views: post._count.votes,
                    createdAt: post.createdAt.toISOString(),
                }
            })))
        }
        throw Errors.UNAUTHORIZED()
    }

    async updatePost(request: any): Promise<any> {
        if (!request.id) throw Errors.MISSING_ID()
        const tags = request.tags.length ? parseTags(request.tags.trim()) : undefined
        if (!tags) throw Errors.INVALID_TAGS()
        request.nsfw = boolify(request.nsfw)
        const post = await this.postRepository.getById(request)
        if (!post) throw Errors.NOT_FOUND()
        const mediaData = await this.storage.getFileData(request.media, ImageType.MEDIA)
        const thumbData = await this.storage.getFileData(request.thumb ?? request.media, ImageType.THUMBNAIL)
        if (thumbData && thumbData.type !== MediaType.IMAGE) throw Errors.INVALID_THUMB()
        request = {
            ...request,
            text: request.text ?? undefined,
            mediaType: mediaData?.type,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url,
            thumbnailWidth: thumbData?.size.width ?? mediaData?.size.width,
            thumbnailHeight: thumbData?.size.height ?? mediaData?.size.height,
            nsfw: request.nsfw,
            tags,
            minTierId: request.minTierId
        }
        await this.postRepository.update(request);
        await this.storage.delete(post.mediaUrl)
        await this.storage.delete(post.thumbUrl)
        await this.storage.upload(mediaData)
        await this.storage.upload(thumbData)
    }

    async deletePost(request: any): Promise<any> {
        const found = await this.postRepository.getById(request)
        if (!found) throw Errors.NOT_FOUND()

        const post = await this.db.post.update({
            select: {
                id: true, mediaUrl: true, thumbUrl: true,
                authors: { select: { id: true } }
            },
            where: { id: request.id, authors: { some: { id: request.user.id } } },
            data: {
                authors: {
                    disconnect: { id: request.user.id }
                }
            }
        })

        if (post.authors.length === 0) {
            await this.storage.delete(post.mediaUrl)
            await this.storage.delete(post.thumbUrl)
            await this.postRepository.delete(request)
        }
    }
    async postStreamKey(request: any): Promise<any> {
        if (request.key) {
            await this.storage.stream(request.key)
        }
        throw Errors.NOT_FOUND()
    }

    async voteSet(request: any): Promise<any> {
        if (!request.vote && !validString(request.postId)) throw Errors.MISSING_VOTE()
        let vote = numify(request.vote) || 0
        if (vote < 0) vote = -1
        else if (vote > 0) vote = 1
        const post = await this.postRepository.getById(request)
        if (!post) throw Errors.NOT_FOUND()
        request = {
            ...request,
            vote
        }
        await this.postRepository.voteSet(request)

    }
}