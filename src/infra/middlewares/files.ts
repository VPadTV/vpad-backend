import os from 'os'
import multer, { memoryStorage } from 'multer'

export type FileRawUpload = {
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export const files = multer({
    dest: os.tmpdir(),
    storage: memoryStorage(),
})