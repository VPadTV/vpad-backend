import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostCreateRequest = {
    user: User
    title: string
    text: string
    mediaBase64: string
    thumbBase64?: string
}

export type PostCreateResponse = {
    id: string
}

export async function postCreate(req: PostCreateRequest, db: DatabaseClient, storage: Storage): Promise<PostCreateResponse> {
    const mediaData = storage.getFileData(req.mediaBase64)
    const thumbData = storage.getFileData(req.thumbBase64)
    const post = await db.post.create({
        data: {
            userId: req.user.id,
            title: req.title,
            text: req.text,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url
        }
    })
    await storage.upload(mediaData)
    await storage.upload(thumbData)

    return { id: post.id }
}