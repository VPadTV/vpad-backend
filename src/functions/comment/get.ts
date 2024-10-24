import { Errors } from '@plugins/http'
import { SimpleUserMapper } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'
import { CommentMapper } from '@infra/mappers/comment'

export type CommentGetRequest = {
    id: string
}

export type CommentGetResponse = {
    text: string
    childrenCount: number
    meta: {
        user: SimpleUserMapper
        createdAt: string
        updatedAt: string
    }
}

export async function commentGet(req: Req<CommentGetRequest>, db: DatabaseClient): Promise<CommentGetResponse> {
    const comment = await db.comment.findFirst({
        where: { id: req.id },
        select: CommentMapper.selector,
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