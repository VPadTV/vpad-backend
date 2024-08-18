import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { UserHttpReq } from '@plugins/requestBody'

export type CommentDeleteRequest = {
    id: string
}

export type CommentDeleteResponse = {}

export async function commentDelete(req: UserHttpReq<CommentDeleteRequest>, db: DatabaseClient): Promise<CommentDeleteResponse> {
    const comment = await db.comment.delete({
        where: { id: req.id, userId: req.user.id },
    })

    if (!comment) throw Errors.NOT_FOUND()

    return {}
}