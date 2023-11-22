import { Errors } from "@domain/helpers"
import { FileStorage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostEditRequest = {
    user: User
    id: string
    text?: string
    mediaBase64?: string
}

export type PostEditResponse = {}

export async function postEdit(req: PostEditRequest, db: DatabaseClient, storage: FileStorage): Promise<PostEditResponse> {
    let mediaUrl: string | undefined
    const post = await db.post.findFirst({ where: { id: req.id } })
    if (!post) throw Errors.NOT_FOUND()

    // FIXME: if update fails, old video is still deleted
    if (req.mediaBase64) {
        if (post.mediaUrl)
            await storage.delete(post?.mediaUrl)
        mediaUrl = await storage.upload(req.mediaBase64)
    }

    await db.post.update({
        where: { id: req.id },
        data: {
            text: req.text ?? undefined,
            mediaUrl: mediaUrl,
        }
    })
    return {}
}