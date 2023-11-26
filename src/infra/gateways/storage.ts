import AWS from 'aws-sdk'
import { MimeTypes } from './mimeTypes'
import crypto from 'crypto';
import { FileRawUpload } from '@infra/middlewares';
import { MediaType } from '@prisma/client';

export type FileUpload = {
    id: string;
    mimeType: string;
    extension: string;
    type: MediaType
    buffer: Buffer;
    url: string
}

export type StorageClient = AWS.S3
export class Storage {
    private static instance: Storage;
    private client: StorageClient

    private constructor() {
        this.client = new AWS.S3({
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

    getUrl(id: string, extension: string) {
        return `https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/${id}.${extension}`
    }

    getFileData(file?: FileRawUpload): FileUpload | undefined {
        if (!file) return undefined
        let fileId: string = crypto.randomBytes(16).toString('hex')
        const extension = MimeTypes.extension(file.mimetype)
        const type = MimeTypes.getType(file.mimetype)
        return {
            id: fileId,
            mimeType: file.mimetype,
            extension,
            type,
            buffer: file.buffer,
            url: this.getUrl(fileId, extension)
        }
    }

    async upload(fileData?: FileUpload): Promise<void> {
        if (!fileData) return
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

    async delete(url?: string | null): Promise<void> {
        if (!url) return
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