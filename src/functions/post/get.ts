import { Errors } from '@helpers/http'
import { DatabaseClient } from '@infra/gateways/database'
import { SimpleUser } from '@infra/mappers/user'
import { User } from '@prisma/client'

export type PostGetRequest = {
    user?: User
    id: string
}

export type PostGetResponse = {
    title: string
    text: string
    mediaType: string
    mediaUrl: string
    thumbUrl?: string
    meta: {
        nsfw: boolean
        tags: string[]
        minTier: {
            id: string
            name: string
            price: number
        } | undefined
        authors: SimpleUser[]
        likes: number
        dislikes: number
        views: number
        myVote: number
        createdAt: string
        updatedAt: string
    }
}

export async function postGet(req: PostGetRequest, db: DatabaseClient): Promise<PostGetResponse> {
    const post = await db.post.findFirst({
        where: {
            id: req.id
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
    if (!post) throw Errors.NOT_FOUND()

    if (post.minTier && post.minTier.price.greaterThan(0)) {
        // TODO: Fix `post.authors[0]` check.
        if (!req.user) throw Errors.UNAUTHORIZED()
        const userTier = await db.subscriptionTier.findFirst({
            where: {
                creatorId: post.authors[0].id,
                subscribers: {
                    some: { userId: req.user.id }
                },
            },
            select: {
                price: true
            }
        })
        if (!userTier)
            throw Errors.BAD_REQUEST()
        if (userTier?.price < post.minTier.price)
            throw Errors.LOW_TIER()
    }

    const [likes, dislikes, views, myVote] = await db.$transaction([
        db.votes.count({
            where: { postId: post.id, vote: 1 }
        }),
        db.votes.count({
            where: { postId: post.id, vote: -1 }
        }),
        db.votes.count({
            where: { postId: post.id },
        }),
        db.votes.findFirst({
            where: { postId: post.id, userId: req.user?.id }
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
            authors: post.authors,
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
            views: views ?? 0,
            myVote: myVote?.vote ?? 0,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }
    }
}