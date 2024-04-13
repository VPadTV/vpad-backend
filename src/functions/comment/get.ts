import { Errors } from '@helpers/http'
import { SimpleUser } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'

export type CommentGetRequest = {
    user: User
    id: string
}

export type CommentGetResponse = {
    text: string
    childrenCount: number
    meta: {
        user: SimpleUser
        createdAt: string
        updatedAt: string
    }
}

export async function commentGet(req: CommentGetRequest, db: DatabaseClient): Promise<CommentGetResponse> {
    const comment = await db.comment.findFirst({
        where: { id: req.id },
        select: {
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
            user: comment.user,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
        },
    }
}