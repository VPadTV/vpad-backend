import { Response, Request } from 'express'
import { parseBody } from "@infra/middlewares/parseBody";
import { Json } from '@plugins/http';

type MulterFiles = { [fieldname: string]: Express.Multer.File[] }
type RequestFiles = { [fieldname: string]: Express.Multer.File }

const transformFiles = (multerFiles: MulterFiles) => {
    const files: RequestFiles = {}
    for (const field in multerFiles)
        files[field] = multerFiles[field][0]
    return files
}

export function route<T>(fn: (request: T) => Promise<Json>) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(req.body) ? { data: req.body } : req.body
        const files = transformFiles(req.files as MulterFiles)

        let data = await fn({
            headers: req.headers,
            ...files,
            ...parseBody({
                ...body,
                ...req.params,
                ...req.query,
            }),
            ...req.middleware,
        })
        if (Array.isArray(data)) data = { data }

        return res.status(200).json({ ...data, token: data.token })
    }
}