import { decodeBase64File } from '@domain/helpers/decodeBase64File'
import { S3 } from 'aws-sdk'

export type UploadFileRequest = {
  readonly mimeType: string
  readonly buffer: Buffer
}

export type StorageClient = S3
export class StorageGateway {
  private static instance: StorageGateway;
  private client: StorageClient

  private constructor() {
    this.client = new S3({
      region: process.env.BB_S3_REGION,
      endpoint: `s3.${process.env.BB_S3_REGION}.backblazeb2.com`,
      s3ForcePathStyle: true,
    })
  }

  static get(): StorageGateway {
    if (!this.instance)
      this.instance = new StorageGateway()
    return this.instance
  }

  async upload(fileBase64: string): Promise<string> {
    const key = Date.now().toString()
    const fileData = decodeBase64File(fileBase64)
    await this.client
      .putObject({
        Bucket: process.env.BB_BUCKET!,
        Key: key,
        Body: fileData.buffer,
        ContentEncoding: 'base64',
        ContentType: fileData.mimeType
      })
      .promise()
    return `https://${process.env.BB_BUCKET!}.s3.backblazeb2.com/${key}`
  }

  async delete(key: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: process.env.BB_BUCKET!,
        Key: key,
      })
      .promise()
  }
}