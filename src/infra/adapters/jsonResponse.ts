import { HttpError, HttpResponse } from '@domain/helpers'
import { Response, Request } from 'express'
import {parseBody} from "@infra/middlewares/parseBody";

type MulterFiles = { [fieldname: string]: Express.Multer.File[] }
type RequestFiles = { [fieldname: string]: Express.Multer.File }

const transformFiles = (multerFiles: MulterFiles) => {
    const files: RequestFiles = {}
    for (const field in multerFiles)
        files[field] = multerFiles[field][0]
    return files
}

export function jsonResponse<T, R extends HttpResponse>(fn: (request: T) => Promise<R>) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(parseBody(req.body)) ? { data: parseBody(req.body) } : parseBody(req.body)
        const files = transformFiles(req.files as MulterFiles)

        try {
            const { statusCode, data } = await fn({
                ...body,
                ...files,
                ...req.params,
                ...req.query,
                ...res.locals,
            })
            return res.status(statusCode).json({ ...data, token: data.token ?? req.params?.token })
        } catch (error) {
            console.error(`** Route **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.code).json({ error: error.message })
            return res.status(500).json({ error: error.code ?? error.message })
        }
    }
}
