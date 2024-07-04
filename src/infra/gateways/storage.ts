import AWS, { type S3 } from 'aws-sdk'
import { MimeTypes } from './mimeTypes'
import crypto from 'crypto';
import { FileRawUpload } from '@infra/middlewares';
import { MediaType } from '@prisma/client';
import { Readable, ReadableOptions } from 'stream';
import { Errors } from 'src/plugins/http';
import sharp from 'sharp';

export type FileUpload = {
    key: string;
    mimeType: string;
    type: MediaType
    buffer: Buffer;
    url: string;
    size: { width?: number, height?: number }
}

export type ModifyVideo = {
    resolution: string
}

export type StreamResponse = {
    stream: SmartStream;
    ContentLength: number;
    ContentType: string;
}


// in pixels
export enum ImageType {
    MEDIA = 2000,
    THUMBNAIL = 300
}

export type StorageClient = S3
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

    static getUrl(key: string) {
        return `https://f004.backblazeb2.com/file/${process.env.BB_BUCKET!}/${key}`
    }

    async processAndResizeImage(buf: Buffer, imageType: ImageType): Promise<Buffer> {
        let instance = sharp(buf)
        const meta = await instance.metadata()
        if ((meta.width && meta.width > imageType) || (meta.height && meta.height > imageType))
            instance = instance.resize({
                width: imageType,
                height: imageType,
                fit: 'inside',
            })
        return instance
            .webp()
            .toBuffer()
    }

    async getFileData(file: FileRawUpload | undefined, imageType: ImageType): Promise<FileUpload | undefined> {
        if (!file) return undefined
        let key: string = crypto.randomBytes(16).toString('hex')
        const type = MimeTypes.getType(file.mimetype)
        let width
        let height
        let processed: Buffer | undefined
        if (type === MediaType.IMAGE) {
            processed = await this.processAndResizeImage(file.buffer, imageType)
            const meta = await sharp(processed).metadata()
            if (meta) {
                width = meta.width
                height = meta.height
            }
        } else {
            // process video here
            processed = file.buffer
        }
        return {
            key,
            mimeType: file.mimetype,
            type,
            buffer: processed,
            url: Storage.getUrl(key),
            size: {
                width, height
            }
        }
    }

    async upload(fileData?: FileUpload): Promise<void> {
        if (!fileData) return
        await this.client
            .putObject({
                Bucket: process.env.BB_BUCKET!,
                Key: fileData.key,
                Body: fileData.buffer,
                ContentType: fileData.mimeType
            })
            .promise()
    }

    async delete(url?: string | null): Promise<void> {
        if (!url) return
        const split = url.split('/')
        const key = split[split.length - 1]
        const r = await this.client
            .deleteObject({
                Bucket: process.env.BB_BUCKET!,
                Key: key,
            })
            .promise()
        console.log(r);
    }

    async stream(key: string): Promise<StreamResponse> {
        const params = {
            Bucket: process.env.BB_BUCKET!,
            Key: key
        }
        const { ContentLength, ContentType } = await this.client.headObject(params).promise()
        if (!ContentLength || !ContentType) throw Errors.FAILED_TO_DOWNLOAD()
        const stream = new SmartStream(params, this.client, ContentLength);
        return {
            stream,
            ContentLength,
            ContentType,
        }
    }
}

export class SmartStream extends Readable {
    _currentCursorPosition = 0;
    _s3DataRange = 2048 * 1024;
    _maxContentLength: number;
    _s3: S3; // AWS.S3 instance
    _s3StreamParams: S3.GetObjectRequest;

    constructor(
        parameters: S3.GetObjectRequest,
        s3: S3,
        maxLength: number,
        nodeReadableStreamOptions?: ReadableOptions
    ) {
        super(nodeReadableStreamOptions);
        this._maxContentLength = maxLength;
        this._s3 = s3;
        this._s3StreamParams = parameters;
    }

    _read() {
        if (this._currentCursorPosition > this._maxContentLength) {
            this.push(null);
        } else {
            const range = this._currentCursorPosition + this._s3DataRange;
            const adjustedRange =
                range < this._maxContentLength ? range : this._maxContentLength;
            this._s3StreamParams.Range = `bytes=${this._currentCursorPosition}-${adjustedRange}`;
            this._currentCursorPosition = adjustedRange + 1;
            this._s3.getObject(this._s3StreamParams, (error, data) => {
                if (error)
                    this.destroy(error);
                else
                    this.push(data.Body);
            });
        }
    }
}