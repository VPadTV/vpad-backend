import mimeTypes from 'mime-types'
export class MimeTypes {
    static extension(mimeType: string): string {
        return mimeTypes.extension(mimeType) || ""
    }
}