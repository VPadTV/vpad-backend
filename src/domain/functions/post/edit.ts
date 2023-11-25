import { Errors } from "@domain/helpers"
import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostEditRequest = {
    user: User
    id: string
    text?: string
    mediaBase64?: string
    thumbBase64?: string
}

export type PostEditResponse = {}

export async function postEdit(req: PostEditRequest, db: DatabaseClient, storage: Storage): Promise<PostEditResponse> {

    const postFound = await db.post.findFirst({ where: { id: req.id, userId: req.user.id } })
    if (!postFound) throw Errors.NOT_FOUND()

    let mediaData = req.mediaBase64 ?
        storage.getFileData(req.mediaBase64) : undefined
    let thumbData = req.thumbBase64 ?
        storage.getFileData(req.thumbBase64) : undefined

    await db.post.update({
        where: { id: req.id },
        data: {
            text: req.text ?? undefined,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url,
        }
    })

    if (postFound.mediaUrl) await storage.delete(postFound.mediaUrl)
    if (postFound.thumbUrl) await storage.delete(postFound.thumbUrl)

    if (mediaData) await storage.upload(mediaData)
    if (thumbData) await storage.upload(thumbData)

    return {}
}