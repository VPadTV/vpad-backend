import { Errors } from "@domain/helpers"
import { parseTags } from "@domain/helpers/parseTags"
import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { FileRawUpload } from "@infra/middlewares"
import { User } from "@prisma/client"

export type PostCreateRequest = {
    user: User
    title: string
    text: string
    media: FileRawUpload
    thumb?: FileRawUpload
    tags: string
}

export type PostCreateResponse = {
    id: string
}

export async function postCreate(req: PostCreateRequest, db: DatabaseClient, storage: Storage): Promise<PostCreateResponse> {
    if (!req.title) throw Errors.MISSING_TITLE()
    if (!req.text) throw Errors.MISSING_TEXT()
    if (!req.media) throw Errors.MISSING_MEDIA()
    let tags: string[] | false = []
    if (req.tags && req.tags.length) {
        tags = parseTags(req.tags.trim())
        if (tags === false) throw Errors.BAD_REQUEST()
    }

    const mediaData = storage.getFileData(req.media)!
    const thumbData = storage.getFileData(req.thumb)
    const post = await db.post.create({
        data: {
            userId: req.user.id,
            title: req.title,
            text: req.text,
            mediaType: mediaData.type,
            mediaUrl: mediaData.url,
            thumbUrl: thumbData?.url,
            tags,
        }
    })
    await storage.upload(mediaData)
    await storage.upload(thumbData)

    return { id: post.id }
}