import { Errors } from '@plugins/http'
import { SimpleUserMapper } from '@infra/mappers/user'
import { Paginate, paginate } from '@plugins/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { MediaType, Prisma, User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { UserReq } from '@plugins/requestBody'
import { PostMapper } from '@infra/mappers/post'

export type PostGetManyRequest = {
    user?: User
    userTierId?: string
    creatorId?: string
    sortBy: 'latest' | 'oldest' | 'high-views' | 'low-views'
    titleSearch?: string
    nsfw?: boolean

    page: number
    size: number
}

export type PostGetManyResponse = Paginate<{
    id: string
    title: string
    text: string | null
    mediaUrl: string
    mediaType: MediaType,
    thumbUrl?: string
    meta: {
        width?: number,
        height?: number,
        nsfw: boolean
        tags: string[]
        author: SimpleUserMapper
        credits: {
            user: SimpleUserMapper,
            description: string
        }[]
        series: {
            id: string
            name: string
        } | null
        views: number
        createdAt: Date
        updatedAt: Date
    }
}>

export type PostSort = {
    createdAt: 'asc' | 'desc'
} | {
    votes: {
        _count: 'asc' | 'desc'
    }
}

export async function postGetMany(req: UserReq<PostGetManyRequest>, db: DatabaseClient): Promise<PostGetManyResponse> {
    let page = +(req.page ?? 0)
    let size = +(req.size ?? 100)

    let userTierValue = new Decimal(0)
    if (req.user && req.userTierId) {
        const userTier = await db.subscriptionTier.findFirst({
            where: {
                id: req.userTierId,
                subscribers: { some: { userId: req.user.id } },
            },
            select: { price: true }
        })
        if (userTier)
            userTierValue = userTier.price
        else
            throw Errors.INVALID_TIER()
    }

    let orderBy: Prisma.PostOrderByWithRelationInput
    switch (req.sortBy) {
        case 'low-views':
            orderBy = { votes: { _count: 'asc' } }
            break
        case 'high-views':
            orderBy = { votes: { _count: 'desc' } }
            break
        case 'oldest':
            orderBy = { createdAt: 'asc' }
            break
        case 'latest':
            orderBy = { createdAt: 'desc' }
            break
        default:
            throw Errors.INVALID_SORT()
    }
    let where: Prisma.PostWhereInput = {
        authorId: req.creatorId,
        OR: [
            { minTier: { price: { lte: userTierValue } } },
            { minTier: null },
        ],
        nsfw: req.nsfw ?? false,
    }

    if (req.titleSearch) {
        where = {
            ...where,
            title: {
                search: req.titleSearch
            }
        }
    }

    const [posts, total] = await db.$transaction([
        db.post.findMany({
            skip: page * size,
            take: size,
            where,
            select: PostMapper.selector,
            orderBy
        }),
        db.post.count({ where }),
    ])

    return paginate(total, page, size, posts.map(post => ({
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
            author: post.author,
            credits: post.credits,
            series: post.series,
            views: post._count.votes,
            createdAt: post.createdAt,
            updatedAt: post.createdAt,
        }
    })))
}
