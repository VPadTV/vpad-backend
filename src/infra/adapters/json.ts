import { Json } from '@plugins/http'
import { Response, Request } from 'express'
import { parseBody } from "@infra/middlewares/parseBody";
import { handleError } from './handleError';

type MulterFiles = { [fieldname: string]: Express.Multer.File[] }
type RequestFiles = { [fieldname: string]: Express.Multer.File }

const transformFiles = (multerFiles: MulterFiles) => {
    const files: RequestFiles = {}
    for (const field in multerFiles)
        files[field] = multerFiles[field][0]
    return files
}

export function jsonResponse<T>(fn: (request: T, ...args: any[]) => Promise<Json>, ...args: any[]) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(req.body) ? { data: req.body } : req.body
        const files = transformFiles(req.files as MulterFiles)

        try {
            let data = await fn({
                headers: req.headers,
                ...files,
                ...parseBody({
                    ...body,
                    ...req.params,
                    ...req.query,
                }),
                ...req.middleware,
            }, ...args)
            if (Array.isArray(data)) data = { data }
            return res.status(200).json({ ...data, token: data.token ?? req.params?.token })
        } catch (error) {
            console.error(`** JSON Route **`)
            console.error(error)
            const httpErr = handleError(error)
            return res.status(httpErr.status).send({ error: httpErr.message })
        }
    }
}