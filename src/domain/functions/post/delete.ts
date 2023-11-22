import { Errors } from "@domain/helpers"
import { FileStorage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostDeleteRequest = {
    user: User
    id: string
}

export type PostDeleteResponse = {}

export async function postDelete(req: PostDeleteRequest, db: DatabaseClient, storage: FileStorage): Promise<PostDeleteResponse> {
    const mediaUrl = await db.$transaction(async (tx) => {
        const post = await tx.post.findFirst({ where: { id: req.id } })

        if (!post) throw Errors.NOT_FOUND()

        const mediaUrl = post.mediaUrl;

        await tx.post.delete({
            where: { id: req.id }
        })

        return mediaUrl
    })

    if (mediaUrl)
        await storage.delete(mediaUrl)

    return {}
}