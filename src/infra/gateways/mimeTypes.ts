import { Errors } from '@plugins/http'
import { MediaType } from '@prisma/client'
import mimeTypes from 'mime-types'
export class MimeTypes {
    static getMediaType(mimeType: string): MediaType {
        if (mimeType.startsWith('image'))
            return MediaType.IMAGE
        if (mimeType.startsWith('video'))
            return MediaType.VIDEO
        throw Errors.INVALID_FILE()
    }

    static extension(mimeType: string): string {
        return mimeTypes.extension(mimeType) || ''
    }
}