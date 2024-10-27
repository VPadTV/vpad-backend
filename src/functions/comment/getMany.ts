import { SimpleUserMapper } from '@infra/mappers/user'
import { Paginate, paginate } from '@plugins/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'
import { CommentMapper } from '@infra/mappers/comment'
import { Prisma } from '@prisma/client'

export type CommentGetManyRequest = {
    postId?: string
    parentId?: string
    sortBy: 'latest' | 'oldest'

    page: number
    size: number
}

export type CommentGetManyResponse = Paginate<{
    id: string
    text: string
    childrenCount: number
    meta: {
        user: SimpleUserMapper
        createdAt: Date,
        updatedAt: Date,
    }
}>

export async function commentGetMany(req: Req<CommentGetManyRequest>, db: DatabaseClient): Promise<CommentGetManyResponse> {
    const page = +(req.page ?? 0)
    const size = +(req.size ?? 100)

    const orderByUpdatedAt = req.sortBy === 'oldest' ? 'asc' : 'desc'

    const where: Prisma.CommentWhereInput = {
        postId: req.postId ?? undefined,
        parentId: req.parentId ?? undefined
    }

    const [comments, total] = await db.$transaction([
        db.comment.findMany({
            skip: page * size,
            take: size,
            where,
            select: CommentMapper.selector,
            orderBy: {
                updatedAt: orderByUpdatedAt
            }
        }),
        db.comment.count({
            where,
        }),
    ])

    return paginate(total, page, size, comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        childrenCount: comment._count.children,
        meta: {
            user: comment.user,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
        }
    })))
}