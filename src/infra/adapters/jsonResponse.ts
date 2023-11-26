import { HttpError, HttpResponse } from '@domain/helpers'
import { Response, Request } from 'express'

type MulterFiles = { [fieldname: string]: Express.Multer.File[] }
type RequestFiles = { [fieldname: string]: Express.Multer.File }

const transformFiles = (multerFiles: MulterFiles) => {
    const files: RequestFiles = {}
    for (const field in multerFiles)
        files[field] = multerFiles[field][0]
    return files
}

export function jsonResponse<T, U extends HttpResponse>(fn: (request: T) => Promise<U>) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(req.body) ? { data: req.body } : req.body
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
            console.error(`<RouteError>: ${error?.message}`)
            console.log(error)
            if (error instanceof HttpError) {
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(500).json({ error })
        }
    }
}
