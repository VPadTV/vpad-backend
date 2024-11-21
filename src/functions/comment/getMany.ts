import { SimpleUser } from '@infra/mappers/user'
import { Paginate, paginate } from '@plugins/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'

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
        user: SimpleUser
        createdAt: string,
        updatedAt: string,
        postId: string
    }
}>

export async function commentGetMany(req: HttpReq<CommentGetManyRequest>, db: DatabaseClient): Promise<CommentGetManyResponse> {
    const page = req.page ?? 1
    const size = req.size ?? 100
    const offset = (page - 1) * size

    const orderByUpdatedAt = req.sortBy === 'oldest' ? 'asc' : 'desc'
    const [comments, total] = await db.$transaction([
        db.comment.findMany({
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? null
            },
            select: {
                id: true,
                text: true,
                user: { select: SimpleUser.selector },
                createdAt: true,
                updatedAt: true,
                postId: true,
                _count: {
                    select: { children: true }
                }
            },
            orderBy: {
                updatedAt: orderByUpdatedAt
            },
            take: size,
            skip: offset
        }),
        db.comment.count({
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? null
            },
            orderBy: {
                updatedAt: orderByUpdatedAt
            }
        }),
    ])

    return paginate(total, page, offset, size, comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        childrenCount: comment._count.children,
        meta: {
            user: comment.user,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
            postId: comment.postId
        }
    })))
}
