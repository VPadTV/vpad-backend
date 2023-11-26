import AWS, { type S3 } from 'aws-sdk'
import { MimeTypes } from './mimeTypes'
import crypto from 'crypto';
import { FileRawUpload } from '@infra/middlewares';
import { MediaType } from '@prisma/client';
import { Readable, ReadableOptions } from "stream";
import { Errors } from '@domain/helpers';

export type FileUpload = {
    id: string;
    mimeType: string;
    extension: string;
    type: MediaType
    buffer: Buffer;
    url: string
}

export type StreamResponse = {
    stream: SmartStream;
    ContentLength: number;
    ContentType: string;
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

    keyFromUrl(url: string): string {
        return url.match(/https.*\/(.*)\./)![1]
    }

    async stream(url: string): Promise<StreamResponse> {
        const params = {
            Bucket: process.env.BB_BUCKET!,
            Key: this.keyFromUrl(url)
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