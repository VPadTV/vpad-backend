import { Errors } from 'src/plugins/http'
import { SimpleUser } from '@infra/mappers/user'
import { Paginate, paginate } from 'src/plugins/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { MediaType, User } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

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
    text: string
    mediaUrl: string
    mediaType: MediaType,
    thumbUrl?: string
    meta: {
        width?: number,
        height?: number,
        nsfw: boolean
        tags: string[]
        authors: SimpleUser[]
        views: number
        createdAt: string
    }
}>

export type PostSort = {
    createdAt: 'asc' | 'desc'
} | {
    votes: {
        _count: 'asc' | 'desc'
    }
}

export async function postGetMany(req: PostGetManyRequest, db: DatabaseClient): Promise<PostGetManyResponse> {
    let orderBy: PostSort
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
    const offset = (+req.page - 1) * +req.size
    let authorsCheck
    if (req.creatorId && req.creatorId.trim().length > 0)
        authorsCheck = {
            some: { id: req.creatorId },
        }
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

    if (req.titleSearch) {
        const words = req.titleSearch.split(' ').map((wd) => wd.trim());
        words.forEach((word) => {
            where.AND[0].OR.push({
                title: {
                    contains: word,
                    mode: 'insensitive'
                }
            })
        })
    }

    const [posts, total] = await db.$transaction([
        db.post.findMany({
            skip: offset,
            take: +req.size,
            where: {
                ...where,
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
                        votes: true
                    }
                },
            },
            orderBy
        }),
        db.post.count({ where }),
    ])

    return paginate(total, +req.page, offset, +req.size, posts.map(post => ({
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