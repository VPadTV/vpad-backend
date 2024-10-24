import { SimpleUserMapper } from "./user";

export class PostMapper {
    static readonly selector = {
        id: true,
        title: true,
        text: true,
        mediaType: true,
        mediaUrl: true,
        thumbUrl: true,
        nsfw: true,
        tags: true,
        author: { select: SimpleUserMapper.selector },
        credits: {
            select: {
                user: {
                    select: SimpleUserMapper.selector
                },
                description: true
            },
        },
        series: {
            select: {
                id: true,
                name: true,
            },
        },
        thumbnailWidth: true,
        thumbnailHeight: true,
        createdAt: true,
        _count: {
            select: {
                votes: true
            }
        },
    }
}