import { Storage } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { Errors } from '@plugins/http'
import { UserHttpReq } from '@plugins/requestBody'

export type PostDeleteRequest = {
    id: string
}

export async function postDelete(req: UserHttpReq<PostDeleteRequest>, db: DatabaseClient, storage: Storage): Promise<{}> {

    if (!req.id) throw Errors.MISSING_ID()

    const post = await db.post.delete({
        where: {
            id: req.id,
            authorId: req.user.id,
        }
    })
    await storage.delete(post.mediaUrl)
    await storage.delete(post.thumbUrl)


    return {}
}
