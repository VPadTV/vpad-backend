import { Errors } from "@domain/helpers"
import { parseTags } from "@domain/helpers/parseTags"
import { boolify } from "@domain/helpers/boolify"
import { Storage } from "@infra/gateways"
import { DatabaseClient } from "@infra/gateways/database"
import { FileRawUpload } from "@infra/middlewares"
import { User } from "@prisma/client"

export type PostEditRequest = {
    user: User
    id: string
    text?: string
    media?: FileRawUpload
    thumb?: FileRawUpload
    nsfw: boolean
    tags: string
    minTierId?: string
}

export type PostEditResponse = {}

export async function postEdit(req: PostEditRequest, db: DatabaseClient, storage: Storage): Promise<PostEditResponse> {
    if (!req.id) throw Errors.MISSING_ID()

    if (boolify(req.nsfw) === null) req.nsfw = false
    let tags: string[] | false = []
    if (req.tags && req.tags.length) {
        tags = parseTags(req.tags.trim())
        if (tags === false) throw Errors.INVALID_TAGS()
    }
    if (!req.minTierId?.length) req.minTierId = undefined

    const postFound = await db.post.findFirst({ where: { id: req.id, userId: req.user.id } })
    if (!postFound) throw Errors.NOT_FOUND()

    let mediaData = storage.getFileData(req.media)
    let thumbData = storage.getFileData(req.thumb)

    await db.post.update({
        where: { id: req.id },
        data: {
            text: req.text ?? undefined,
            mediaType: mediaData?.type,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url,
            nsfw: req.nsfw,
            tags,
            minTierId: req.minTierId
        }
    })

    await storage.delete(postFound.mediaUrl)
    await storage.delete(postFound.thumbUrl)

    await storage.upload(mediaData)
    await storage.upload(thumbData)

    return {}
}