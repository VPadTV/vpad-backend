import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { UserReq } from '@plugins/requestBody'

export type CommentEditRequest = {
    id: string
    text: string
}

export type CommentEditResponse = {
    text: string
    updatedAt: Date
}

export async function commentEdit(req: UserReq<CommentEditRequest>, db: DatabaseClient): Promise<CommentEditResponse> {
    if (!req.id) throw Errors.MISSING_ID()
    if (!req.text) throw Errors.MISSING_TEXT()

    const comment = await db.comment.update({
        where: { id: req.id, userId: req.user.id },
        data: {
            userId: req.user.id,
            text: req.text,
        },
        select: {
            text: true,
            updatedAt: true,
        }
    })
    return comment
}