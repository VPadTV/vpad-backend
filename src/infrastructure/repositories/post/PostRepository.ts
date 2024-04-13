import { MediaType } from '@prisma/client';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';
import { Errors } from '@plugins/errors';
import { ImageType, Storage } from '@plugins/storage';
import { SimpleUser } from '@plugins/user';

export class PostRepository {
    constructor(
        private readonly db: PrismaUseCase,
        private readonly storage: Storage,
    ) { }

    async create(req) {
        const mediaData = await this.storage.getFileData(
            req.media,
            ImageType.MEDIA,
        );
        if (!mediaData) throw Errors.INVALID_FILE();
        const thumbData = await this.storage.getFileData(
            req.thumb ?? req.media,
            ImageType.THUMBNAIL,
        );
        if (!thumbData || (thumbData && thumbData.type !== MediaType.IMAGE))
            throw Errors.INVALID_THUMB();
        const post = await this.db.post.create({
            data: {
                authors: {
                    connect: [{ id: req.user.id }, ...(req.otherAuthorIds ?? [])],
                },
                title: req.title,
                text: req.text,
                mediaUrl: mediaData.url,
                mediaType: mediaData.type,
                thumbUrl: thumbData?.url,
                nsfw: req.nsfw,
                minTierId: req.minTierId,
                thumbnailWidth: thumbData.size.width,
                thumbnailHeight: thumbData.size.height,
                tags: req.tags,
            },
        });
        await this.storage.upload(mediaData);
        await this.storage.upload(thumbData);

        return { id: post.id };
    }
    async getById(req) {
        return await this.db.post.findFirst({
            where: {
                id: req.id,
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
                    select: SimpleUser.selector,
                },
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async getAll(req) {
        const [posts, total] = await this.db.$transaction([
            this.db.post.findMany({
                skip: req.offset,
                take: +req.size,
                where: {
                    ...req.where,
                    nsfw: req.nsfw ?? false,
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
                            votes: true,
                        },
                    },
                },
                orderBy: req.orderBy,
            }),
            this.db.post.count({ where: { ...req.where } }),
        ]);
        return { posts, total };
    }
    async update(req) {
        await this.db.post.update({
            where: { id: req.id },
            data: {
                text: req.text,
                mediaType: req.mediaType,
                mediaUrl: req.mediaUrl,
                thumbUrl: req.thumbUrl,
                thumbnailWidth: req.thumbnailWidth,
                thumbnailHeight: req.thumbnailHeight,
                nsfw: req.nsfw,
                tags: req.tags,
                minTierId: req.minTierId,
            },
        });
    }
    async delete(req) {
        await this.db.post.delete({ where: { id: req.id } });
    }

    async voteSet(req) {
        await this.db.votes.upsert({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId: req.postId,
                },
            },
            create: {
                userId: req.user.id,
                postId: req.postId,
                vote: req.vote,
            },
            update: {
                vote: req.vote,
            },
        });

        return {};
    }
}
