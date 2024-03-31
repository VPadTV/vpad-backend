export type FileRawUpload = {
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export type FileField = { name: string; maxCount: number; }