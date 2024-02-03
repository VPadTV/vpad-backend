import { Errors } from "@helpers/http"
import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostDeleteRequest = {
    user: User
    id: string
}

export type PostDeleteResponse = {}

export async function postDelete(req: PostDeleteRequest, db: DatabaseClient, storage: Storage): Promise<PostDeleteResponse> {
    const post = await db.post.findFirst({ where: { id: req.id }, select: { mediaUrl: true, thumbUrl: true, authors: true } })
    if (!post) throw Errors.NOT_FOUND()

    if (post.authors.length === 1 && post.authors.at(0)?.id === req.id)
        await db.post.delete({ where: { id: req.id } })
    else if (post.authors.length > 1)
        await db.post.update({
            where: {
                id: req.id, authors: {
                    some: { id: req.user.id }
                }
            },
            data: {
                authors: {
                    disconnect: { id: req.id }
                }
            }
        })

    if (post.mediaUrl)
        await storage.delete(post.mediaUrl)
    if (post.thumbUrl)
        await storage.delete(post.thumbUrl)

    return {}
}