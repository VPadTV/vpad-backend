import os from 'os'
import multer, { memoryStorage } from 'multer'

export type FileRawUpload = {
    fieldname: string;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
}

export type FileField = { name: string; maxCount: number; }

const multerMidd = multer({
    dest: os.tmpdir(),
    storage: memoryStorage(),
})

export const fields = (names: string[]) => {
    const fields: FileField[] = []
    for (const name of names)
        fields.push({
            name,
            maxCount: 1
        })
    return multerMidd.fields(fields)
}