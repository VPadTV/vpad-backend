import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { SimpleUser } from '@infra/mappers/user'
import { User } from '@prisma/client'
import { HttpReq } from '@plugins/requestBody'

export type PostGetRequest = {
    user?: User
    id: string
}

export type PostGetResponse = {
    title: string
    text: string | null
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
        } | null
        author: SimpleUser
        credits: {
            user: SimpleUser,
            description: string
        }[]
        series: {
            id: string,
            name: string,
        } | null,
        likes: number
        dislikes: number
        views: number
        myVote: number
        createdAt: string
        updatedAt: string
    }
}

export async function postGet(req: HttpReq<PostGetRequest>, db: DatabaseClient): Promise<PostGetResponse> {
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
            series: {
                select: {
                    id: true,
                    name: true,
                }
            },
            author: {
                select: SimpleUser.selector
            },
            credits: {
                select: {
                    user: {
                        select: SimpleUser.selector
                    },
                    description: true,
                }
            },
            createdAt: true,
            updatedAt: true,
        }
    })
    if (!post) throw Errors.NOT_FOUND()

    if (post.minTier && post.minTier.price.greaterThan(0)) {
        if (!req.user) throw Errors.UNAUTHORIZED()
        const userTier = await db.subscriptionTier.findFirst({
            where: {
                creatorId: post.author.id,
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
            where: { postId: post.id, userId: req.user?.id ?? '' }
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
            } : null,
            author: post.author,
            credits: post.credits,
            series: post.series,
            likes: likes ?? 0,
            dislikes: dislikes ?? 0,
            views: views ?? 0,
            myVote: myVote?.vote ?? 0,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        }
    }
}
