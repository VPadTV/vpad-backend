import { Errors } from '@plugins/http'
import { SimpleUser } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'

export type CommentGetRequest = {
    id: string
}

export type CommentGetResponse = {
    text: string
    childrenCount: number
    meta: {
        postId: string
        user: SimpleUser
        createdAt: string
        updatedAt: string
    }
}

export async function commentGet(req: HttpReq<CommentGetRequest>, db: DatabaseClient): Promise<CommentGetResponse> {
    const comment = await db.comment.findFirst({
        where: { id: req.id },
        select: {
            postId: true,
            text: true,
            user: { select: SimpleUser.selector },
            createdAt: true,
            updatedAt: true,
            _count: {
                select: { children: true }
            }
        }
    })

    if (!comment) throw Errors.NOT_FOUND()

    return {
        text: comment.text,
        childrenCount: comment._count.children,
        meta: {
            postId: comment.postId,
            user: comment.user,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        },
    }
}