import { Errors } from '@plugins/http'
import { parseTags } from '@plugins/parseTags'
import { boolify } from '@plugins/boolify'
import { validString } from '@plugins/validString'
import { ImageType, Storage } from '@infra/gateways'
import { DatabaseClient } from '@infra/gateways/database'
import { FileRawUpload } from '@infra/middlewares'
import { MediaType } from '@prisma/client'
import { UserHttpReq } from '@plugins/requestBody'

export type PostCreateRequest = {
    credits?: {
        userId: string,
        description: string
    }[]
    title: string
    text: string
    media: FileRawUpload
    thumb?: FileRawUpload
    nsfw: boolean
    tags: string
    minTierId?: string
    seriesId?: string
}

export type PostCreateResponse = {
    id: string
}

export async function postCreate(req: UserHttpReq<PostCreateRequest>, db: DatabaseClient, storage: Storage): Promise<PostCreateResponse> {
    if (!validString(req.title)) throw Errors.MISSING_TITLE()
    if (!validString(req.text)) throw Errors.MISSING_TEXT()
    if (!validString(req.tags)) throw Errors.MISSING_TAGS()
    if (!req.media) throw Errors.MISSING_MEDIA()

    req.nsfw = boolify(req.nsfw)
    let tags: string[] | false = []
    tags = parseTags(req.tags!.trim())
    if (tags === false) throw Errors.INVALID_TAGS()
    req.minTierId = validString(req.minTierId)


    const mediaData = await storage.getFileData(req.media, ImageType.MEDIA)
    if (!mediaData) throw Errors.INVALID_FILE()

    let thumbData = await storage.getFileData(req.thumb ?? req.media, ImageType.THUMBNAIL)
    if (!thumbData || (thumbData && thumbData.type !== MediaType.IMAGE)) throw Errors.INVALID_THUMB()

    const post = await db.post.create({
        data: {
            authorId: req.user.id,
            credits: {
                create: req.credits
            },
            title: req.title!,
            text: req.text,
            mediaUrl: mediaData.url,
            mediaType: mediaData.type,
            thumbUrl: thumbData?.url,
            nsfw: req.nsfw,
            minTierId: req.minTierId,
            thumbnailWidth: thumbData.size.width,
            thumbnailHeight: thumbData.size.height,
            seriesId: req.seriesId,
            tags,
        }
    })
    await storage.upload(mediaData)
    await storage.upload(thumbData)

    return { id: post.id }
}
