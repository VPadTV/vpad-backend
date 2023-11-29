import { Errors } from "@domain/helpers"
import { parseTags } from "@domain/helpers/parseTags"
import { boolify } from "@domain/helpers/boolify"
import { validString } from "@domain/helpers/validString"
import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { FileRawUpload } from "@infra/middlewares"
import { MediaType, User } from "@prisma/client"

export type PostCreateRequest = {
    user: User
    title: string
    text: string
    media: FileRawUpload
    thumb?: FileRawUpload
    nsfw: boolean
    tags: string
    minTierId?: string
}

export type PostCreateResponse = {
    id: string
}

export async function postCreate(req: PostCreateRequest, db: DatabaseClient, storage: Storage): Promise<PostCreateResponse> {
    if (!validString(req.title)) throw Errors.MISSING_TITLE()
    if (!validString(req.text)) throw Errors.MISSING_TEXT()
    if (!req.media) throw Errors.MISSING_MEDIA()

    req.nsfw = boolify(req.nsfw)
    let tags: string[] | false = []
    tags = parseTags(req.tags.trim())
    if (tags === false) throw Errors.INVALID_TAGS()
    req.minTierId = validString(req.minTierId)

    const mediaData = storage.getFileData(req.media)
    if (!mediaData) throw Errors.INVALID_FILE()
    const thumbData = storage.getFileData(req.thumb)
    if (thumbData && thumbData.type !== MediaType.IMAGE) throw Errors.INVALID_THUMB()

    const post = await db.post.create({
        data: {
            userId: req.user.id,
            title: req.title,
            text: req.text,
            mediaUrl: mediaData.url,
            mediaType: mediaData.type,
            thumbUrl: thumbData?.url,
            nsfw: req.nsfw,
            minTierId: req.minTierId,
            tags,
        }
    })
    await storage.upload(mediaData)
    await storage.upload(thumbData)

    return { id: post.id }
}