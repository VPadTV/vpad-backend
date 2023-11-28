import { Errors } from "@domain/helpers"
import { SimpleUser } from "@domain/helpers/mappers/user"
import { Paginate, paginate } from "@domain/helpers/paginate"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

export type PostGetManyRequest = {
    user?: User
    userTierId?: string
    creatorId?: string
    sortBy: "latest" | "oldest" | "high-views" | "low-views"
    titleSearch?: string

    page: number
    size: number
}

export type PostGetManyResponse = Paginate<{
    id: string
    title: string
    text: string
    thumbUrl?: string
    meta: {
        tags: string[]
        user: SimpleUser
        views: number
        createdAt: string
    }
}>

export type PostSort = {
    createdAt: "asc" | "desc"
} | {
    votes: {
        _count: "asc" | "desc"
    }
}

export async function postGetMany(req: PostGetManyRequest, db: DatabaseClient): Promise<PostGetManyResponse> {
    let orderBy: PostSort
    let userTierValue = new Decimal(0)
    if (req.user && req.userTierId) {
        const userTier = await db.subscriptionTier.findFirst({
            where: {
                id: req.userTierId,
                subscribers: {
                    some: { userId: req.user.id }
                },
            },
            select: {
                price: true
            }
        })
        if (userTier)
            userTierValue = userTier.price
    }
    switch (req.sortBy) {
        case "low-views":
            orderBy = { votes: { _count: "asc" } }
            break
        case "high-views":
            orderBy = { votes: { _count: "desc" } }
            break
        case "oldest":
            orderBy = { createdAt: "asc" }
            break
        case "latest":
        default:
            orderBy = { createdAt: "desc" }
            break
    }
    const offset = (+req.page - 1) * +req.size
    const [posts, total] = await db.$transaction([
        db.post.findMany({
            skip: offset,
            take: +req.size,
            where: {
                userId: req.creatorId ?? undefined,
                title: req.titleSearch ? {
                    search: req.titleSearch
                } : undefined,
                OR: [
                    { minTier: { price: { lte: userTierValue } } },
                    { minTier: null },
                ],
            },
            select: {
                id: true,
                title: true,
                text: true,
                thumbUrl: true,
                tags: true,
                user: { select: SimpleUser.selector },
                createdAt: true,
                _count: {
                    select: {
                        votes: true
                    }
                },
            },
            orderBy
        }),
        db.post.count({
            where: {
                userId: req.creatorId ?? undefined
            }
        }),
    ])

    if (!posts || posts.length === 0) throw Errors.NOT_FOUND()

    return paginate(total, +req.page, offset, +req.size, posts.map(post => ({
        id: post.id,
        title: post.title,
        text: post.text,
        thumbUrl: post.thumbUrl ?? undefined,
        meta: {
            tags: post.tags,
            user: post.user,
            views: post._count.votes,
            createdAt: post.createdAt.toISOString(),
        }
    })))
}