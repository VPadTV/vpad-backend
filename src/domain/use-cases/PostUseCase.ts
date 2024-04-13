import { validString } from '@plugins/validString';
import { Errors } from '@plugins/errors';
import { boolify } from '@plugins/boolify';
import { parseTags } from '@plugins/parseTags';
import { PrismaUseCase } from './PrismaUseCase';
import { paginate } from '@plugins/paginate';
import { ImageType, Storage } from '@plugins/storage';
import { MediaType } from '@prisma/client';
import { numify } from '@plugins/numify';
import { PostRepository } from '@infrastructure/repositories/post/PostRepository';
import { SubscriptionTierRepository } from '@infrastructure/repositories/subscriptionTier/SubscriptionTierRepository';

export class PostUseCase {
    constructor(
        private postRepo: PostRepository,
        private subscriptionTierRepository: SubscriptionTierRepository,
        private readonly db: PrismaUseCase,
        private readonly storage: Storage,
    ) { }

    async createPost(req) {
        if (validString(req.title)) throw Errors.MISSING_TITLE();
        if (validString(req.text)) throw Errors.MISSING_TEXT();
        if (validString(req.tags)) throw Errors.MISSING_TAGS();
        if (validString(req.media)) throw Errors.MISSING_MEDIA();
        req.nsfw = boolify(req.nsfw);
        const tags = parseTags(req.tags.trim());
        if (!tags) throw Errors.INVALID_TAGS();
        req.minTierId = validString(req.minTierId);
        const otherAuthorIds = req.otherAuthorIds?.map((id) => ({ id }));
        req.otherAuthorIds = otherAuthorIds;
        return this.postRepo.create(req);
    }

    async getPostById(req) {
        const post = await this.postRepo.getById(req);

        if (!post) throw Errors.NOT_FOUND();
        if (!req.user) throw Errors.UNAUTHORIZED();
        if (post.minTier && post.minTier.price.greaterThan(0)) {
            const userTier = await this.subscriptionTierRepository.getByIdAndUserId({
                id: post.authors[0].id,
                userId: req.user.id,
            });
            if (!userTier) throw Errors.BAD_REQUEST();
            if (userTier?.price.lessThan(post.minTier.price)) throw Errors.LOW_TIER();
        }
        const [likes, dislikes, views, myVote] = await this.db.$transaction([
            this.db.votes.count({
                where: { postId: post.id, vote: 1 },
            }),
            this.db.votes.count({
                where: { postId: post.id, vote: -1 },
            }),
            this.db.votes.count({
                where: { postId: post.id },
            }),
            this.db.votes.findFirst({
                where: { postId: post.id, userId: req.user?.id ?? '' },
            }),
        ]);
        return {
            title: post.title,
            text: post.text,
            mediaUrl: post.mediaUrl,
            mediaType: post.mediaType,
            thumbUrl: post.thumbUrl ?? undefined,
            meta: {
                nsfw: post.nsfw,
                tags: post.tags,
                minTier: post.minTier
                    ? {
                        id: post.minTier.id,
                        name: post.minTier.name,
                        price: post.minTier.price.toNumber(),
                    }
                    : undefined,
                authors: [post.authors[0]],
                likes: likes ?? 0,
                dislikes: dislikes ?? 0,
                views: views ?? 0,
                myVote: myVote?.vote ?? 0,
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString(),
            },
        };
    }
    async getAllPosts(req) {
        if (!req.user || !req.userTierId) throw Errors.UNAUTHORIZED()
        const userTier = await this.subscriptionTierRepository.getByIdAndUserId({
            id: req.userTierId,
            userId: req.user.id,
        });
        if (!userTier) throw Errors.INVALID_TIER();
        const { price: userTierValue } = userTier;
        const offset = (+req.page - 1) * +req.size;
        const authorsCheck =
            req.creatorId && req.creatorId.trim().length > 0
                ? { some: { id: req.creatorId } }
                : undefined;
        const where = {
            authors: authorsCheck,
            OR: [{ minTier: { price: { lte: userTierValue } } }, { minTier: null }],
            AND: [
                {
                    OR: [],
                },
            ],
        };
        if (req.titleSearch) {
            const words = req.titleSearch.split(' ').map((wd) => wd.trim());
            words.forEach((word) => {
                where.AND[0].OR.push({
                    title: { contains: word, mode: 'insensitive' },
                });
            });
        }
        let orderBy: unknown;
        switch (req.sortBy) {
            case 'low-views':
                orderBy = { votes: { _count: 'asc' } };
                break;
            case 'high-views':
                orderBy = { votes: { _count: 'desc' } };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            default:
                throw Errors.INVALID_SORT();
        }

        req = { ...req, where, orderBy, offset };

        const { posts, total } = await this.postRepo.getAll(req);

        return paginate(
            total,
            +req.page,
            offset,
            +req.size,
            posts.map((post) => ({
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
                },
            })),
        );
    }
    async updatePost(req) {
        if (!req.id) throw Errors.MISSING_ID();
        const tags = req.tags.length
            ? parseTags(req.tags.trim())
            : undefined;
        if (!tags) throw Errors.INVALID_TAGS();
        req.nsfw = boolify(req.nsfw);
        const post = await this.postRepo.getById(req);
        if (!post) throw Errors.NOT_FOUND();
        const mediaData = await this.storage.getFileData(
            req.media,
            ImageType.MEDIA,
        );
        const thumbData = await this.storage.getFileData(
            req.thumb ?? req.media,
            ImageType.THUMBNAIL,
        );
        if (thumbData && thumbData.type !== MediaType.IMAGE)
            throw Errors.INVALID_THUMB();
        req = {
            ...req,
            text: req.text ?? undefined,
            mediaType: mediaData?.type,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url,
            thumbnailWidth: thumbData?.size.width ?? mediaData?.size.width,
            thumbnailHeight: thumbData?.size.height ?? mediaData?.size.height,
            nsfw: req.nsfw,
            tags,
            minTierId: req.minTierId,
        };
        await this.postRepo.update(req);
        await this.storage.delete(post.mediaUrl);
        await this.storage.delete(post.thumbUrl);
        await this.storage.upload(mediaData);
        await this.storage.upload(thumbData);
    }
    async deletePost(req) {
        const found = await this.postRepo.getById(req);
        if (!found) throw Errors.NOT_FOUND();

        const post = await this.db.post.update({
            select: {
                id: true,
                mediaUrl: true,
                thumbUrl: true,
                authors: { select: { id: true } },
            },
            where: { id: req.id, authors: { some: { id: req.user.id } } },
            data: {
                authors: {
                    disconnect: { id: req.user.id },
                },
            },
        });

        if (post.authors.length === 0) {
            await this.storage.delete(post.mediaUrl);
            await this.storage.delete(post.thumbUrl);
            await this.postRepo.delete(req);
        }
    }
    async postStreamKey(req) {
        if (req.key) {
            await this.storage.stream(req.key);
        }
        throw Errors.NOT_FOUND();
    }
    async voteSet(req) {
        if (!req.vote && !validString(req.postId))
            throw Errors.MISSING_VOTE();
        let vote = numify(req.vote) || 0;
        if (vote < 0) vote = -1;
        else if (vote > 0) vote = 1;
        const post = await this.postRepo.getById(req);
        if (!post) throw Errors.NOT_FOUND();
        req = {
            ...req,
            vote,
        };
        await this.postRepo.voteSet(req);
    }
}
