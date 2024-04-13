import { SimpleUser } from '@infra/mappers/user'
import { Paginate, paginate } from '@helpers/paginate'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type CommentGetManyRequest = {
    user: User
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
    }
}>

export async function commentGetMany(req: CommentGetManyRequest, db: DatabaseClient): Promise<CommentGetManyResponse> {
    const offset = (req.page - 1) * req.size

    const orderByUpdatedAt = req.sortBy === 'oldest' ? 'asc' : 'desc'
    const [comments, total] = await db.$transaction([
        db.comment.findMany({
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? undefined
            },
            select: {
                id: true,
                text: true,
                user: { select: SimpleUser.selector },
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { children: true }
                }
            },
            orderBy: {
                updatedAt: orderByUpdatedAt
            }
        }),
        db.comment.count({
            where: {
                postId: req.postId ?? undefined,
                parentId: req.parentId ?? undefined
            }
        }),
    ])

    return paginate(total, req.page, offset, req.size, comments.map(comment => ({
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