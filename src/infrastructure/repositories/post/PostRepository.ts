import { MediaType } from "@prisma/client";
import { IPostRepository } from "@domain/interfaces/post/IPostRepository";
import { PrismaUseCase } from "@domain/use-cases/PrismaUseCase";
import { Errors } from "@plugins/errors";
import { ImageType, Storage } from "@plugins/storage";
import { SimpleUser } from "@plugins/user";


export class PostRepository implements IPostRepository {
    constructor(private readonly db: PrismaUseCase, private readonly storage: Storage) { }

    async create(request: any): Promise<any> {
        const mediaData = await this.storage.getFileData(request.media, ImageType.MEDIA)
        if (!mediaData) throw Errors.INVALID_FILE()
        const thumbData = await this.storage.getFileData(request.thumb ?? request.media, ImageType.THUMBNAIL)
        if (!thumbData || (thumbData && thumbData.type !== MediaType.IMAGE)) throw Errors.INVALID_THUMB()
        const post = await this.db.post.create({
            data: {
                authors: {
                    connect: [
                        { id: request.user.id },
                        ...(request.otherAuthorIds ?? [])
                    ]
                },
                title: request.title,
                text: request.text,
                mediaUrl: mediaData.url,
                mediaType: mediaData.type,
                thumbUrl: thumbData?.url,
                nsfw: request.nsfw,
                minTierId: request.minTierId,
                thumbnailWidth: thumbData.size.width,
                thumbnailHeight: thumbData.size.height,
                tags: request.tags,
            }
        })
        await this.storage.upload(mediaData)
        await this.storage.upload(thumbData)

        return { id: post.id }
    }
    async getById(request: any): Promise<any> {
        return await this.db.post.findFirst({
            where: {
                id: request.id
            },
            select: {
                id: true,
                title: true,
                text: true,
                mediaType: true,
                mediaUrl: true,
                thumbUrl: true,
                minTier: { select: { id: true, name: true, price: true } },
                nsfw: true,
                tags: true,
                authors: {
                    select: SimpleUser.selector
                },
                createdAt: true,
                updatedAt: true,
            }
        })


    }
    async getAll(request: any): Promise<any> {
        
        const [posts, total] = await this.db.$transaction([this.db.post.findMany({
            skip: request.offset,
            take: +request.size,
            where: {
                ...request.where,
                nsfw: request.nsfw ?? false,
            },
            select: {
                id: true,
                title: true,
                text: true,
                mediaType: true,
                mediaUrl: true,
                thumbUrl: true,
                nsfw: true,
                tags: true,
                authors: { select: SimpleUser.selector },
                thumbnailWidth: true,
                thumbnailHeight: true,
                createdAt: true,
                _count: {
                    select: {
                        votes: true
                    }
                },
            },
            orderBy: request.orderBy
        }),
        this.db.post.count({ where: {...request.where} }),])
        return [posts, total]
    }
    async update(request: any): Promise<any> {


        await this.db.post.update({
            where: { id: request.id },
            data: {
                text: request.text,
                mediaType: request.mediaType,
                mediaUrl: request.mediaUrl,
                thumbUrl: request.thumbUrl,
                thumbnailWidth : request.thumbnailWidth,
                thumbnailHeight: request.thumbnailHeight,
                nsfw: request.nsfw,
                tags: request.tags,
                minTierId: request.minTierId
            }
        })
    }
    async delete(request: any): Promise<any> {
        
        await this.db.post.delete({ where: { id: request.id } })       
    }

    async voteSet(request: any): Promise<any> {

        await this.db.votes.upsert({
            where: {
                userId_postId: {
                    userId: request.user.id,
                    postId: request.postId,
                }
            },
            create: {
                userId: request.user.id,
                postId: request.postId,
                vote: request.vote
            },
            update: {
                vote: request.vote
            }
        })

        return {}
    }
}