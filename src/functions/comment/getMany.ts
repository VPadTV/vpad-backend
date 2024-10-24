import { SimpleUserMapper } from '@infra/mappers/user'
import { Paginate, paginate } from '@plugins/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'
import { CommentMapper } from '@infra/mappers/comment'

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
        createdAt: string,
        updatedAt: string,
    }
}>

export async function commentGetMany(req: Req<CommentGetManyRequest>, db: DatabaseClient): Promise<CommentGetManyResponse> {
    const page = +(req.page ?? 0)
    const size = +(req.size ?? 100)

    const orderByUpdatedAt = req.sortBy === 'oldest' ? 'asc' : 'desc'
    const [comments, total] = await db.$transaction([
        db.comment.findMany({
            skip: page * size,
            take: size,
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? undefined
            },
            select: CommentMapper.selector,
            orderBy: {
                updatedAt: orderByUpdatedAt
            }
        }),
        db.comment.count({
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? undefined
            },
        }),
    ])

    return paginate(total, page, size, comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        childrenCount: comment._count.children,
        meta: {
            user: comment.user,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        }
    })))
}