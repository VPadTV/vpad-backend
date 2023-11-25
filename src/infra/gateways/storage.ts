import { S3 } from 'aws-sdk'
import { MimeTypes } from './mimeTypes'
import { Errors } from '@domain/helpers'
import { randomUUID } from 'crypto';

export type FileData = {
    id: string;
    mimeType: string;
    extension: string;
    buffer: Buffer;
    url: string
}

export type StorageClient = S3
export class Storage {
    private static instance: Storage;
    private client: StorageClient

    private constructor() {
        this.client = new S3({
            region: process.env.BB_S3_REGION,
            endpoint: `s3.${process.env.BB_S3_REGION}.backblazeb2.com`,
            s3ForcePathStyle: true,
        })
    }

    static get(): Storage {
        if (!this.instance)
            this.instance = new Storage()
        return this.instance
    }

    getFileData(fileBase64: string, fileId?: string): FileData {
        if (!fileId) fileId = randomUUID()
        const matches = fileBase64.match(/^data:([a-zA-Z-+/.]+);base64,(.+)$/)
        if (matches?.length !== 3)
            throw Errors.INVALID_FILE()
        const extension = MimeTypes.extension(matches[1])
        return {
            id: fileId,
            mimeType: matches[1],
            extension,
            buffer: Buffer.from(matches[2], 'base64'),
            url: this.getUrl(fileId, extension)
        }
    }

    getUrl(id: string, extension: string) {
        return `https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/${id}.${extension}`
    }

    async upload(fileData: FileData): Promise<void> {
        await this.client
            .putObject({
                Bucket: process.env.BB_BUCKET!,
                Key: fileData.id,
                Body: fileData.buffer,
                ContentEncoding: 'base64',
                ContentType: fileData.mimeType
            })
            .promise()
    }

    async delete(url: string): Promise<void> {
        const split = url.split('/')
        const key = split[split.length - 1]
        await this.client
            .deleteObject({
                Bucket: process.env.BB_BUCKET!,
                Key: key,
            })
            .promise()
    }
}