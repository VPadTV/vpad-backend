import mimeTypes from 'mime-types'
export type MimeTypes = typeof mimeTypes
export class MimeTypesGateway {
  extension(mimeType: string): string {
    return mimeTypes.extension(mimeType) || ""
  }
}