import { Errors } from '@plugins/http'
import { Storage } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { SimpleUser } from '@infra/mappers/user'
import { User } from '@prisma/client'

export type PostDeleteRequest = {
    user: User
    id: string
}

export enum PostDeleteStatus {
    POST_DELETED = 'Post Deleted',
    AUTHOR_REMOVED = 'Author Removed'
}
export type PostDeleteResponse = {
    status: PostDeleteStatus
}

export async function postDelete(req: PostDeleteRequest, db: DatabaseClient, storage: Storage): Promise<PostDeleteResponse> {
    const found = await db.post.findFirst({
        select: { id: true },
        where: { id: req.id, authors: { some: { id: req.user.id } } }
    })

    if (!found)
        throw Errors.NOT_FOUND()

    const post = await db.post.update({
        select: {
            id: true, mediaUrl: true, thumbUrl: true,
            authors: { select: SimpleUser.selector }
        },
        where: { id: req.id, authors: { some: { id: req.user.id } } },
        data: {
            authors: {
                disconnect: { id: req.user.id }
            }
        }
    })

    let status = PostDeleteStatus.AUTHOR_REMOVED
    if (post.authors.length < 1) {
        await db.post.delete({ where: { id: post.id } })
        if (post.mediaUrl)
            await storage.delete(post.mediaUrl)
        if (post.thumbUrl)
            await storage.delete(post.thumbUrl)
        status = PostDeleteStatus.POST_DELETED
    }


    return {
        status
    }
}