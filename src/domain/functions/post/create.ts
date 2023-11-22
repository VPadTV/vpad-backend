import { FileStorage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { User } from "@prisma/client"

export type PostCreateRequest = {
    user: User
    text: string
    mediaBase64: string
}

export type PostCreateResponse = {
    id: string
}

export async function postCreate(req: PostCreateRequest, db: DatabaseClient, storage: FileStorage): Promise<PostCreateResponse> {
    const mediaUrl = await storage.upload(req.mediaBase64)
    const post = await db.post.create({
        data: {
            userId: req.user.id,
            text: req.text,
            mediaUrl,
        }
    })
    return { id: post.id }
}