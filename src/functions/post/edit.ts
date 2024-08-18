import { parseTags } from '@plugins/parseTags'
import { boolify } from '@plugins/boolify'
import { Errors } from '@plugins/http'
import { ImageType, Storage } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { FileRawUpload } from '@infra/middlewares'
import { MediaType, User } from '@prisma/client'
import { UserHttpReq } from '@plugins/requestBody'

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

export async function postEdit(req: UserHttpReq<PostEditRequest>, db: DatabaseClient, storage: Storage): Promise<PostEditResponse> {
    if (!req.id) throw Errors.MISSING_ID()

    req.nsfw = boolify(req.nsfw)
    let tags: string[] | false = []

    if (req.tags && req.tags.length) {
        tags = parseTags(req.tags.trim())
        if (tags === false) throw Errors.INVALID_TAGS()
    }

    if (!req.minTierId?.length) req.minTierId = undefined

    const postFound = await db.post.findFirst({
        where: {
            id: req.id, authors: { some: { id: req.id } }
        }
    })

    if (!postFound) throw Errors.NOT_FOUND()

    let mediaData = await storage.getFileData(req.media, ImageType.MEDIA)
    let thumbData = await storage.getFileData(req.thumb ?? req.media, ImageType.THUMBNAIL)
    if (thumbData && thumbData.type !== MediaType.IMAGE) throw Errors.INVALID_THUMB()

    await db.post.update({
        where: { id: req.id },
        data: {
            text: req.text ?? undefined,
            mediaType: mediaData?.type,
            mediaUrl: mediaData?.url,
            thumbUrl: thumbData?.url,
            thumbnailWidth: thumbData?.size.width ?? mediaData?.size.width,
            thumbnailHeight: thumbData?.size.height ?? mediaData?.size.height,
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
