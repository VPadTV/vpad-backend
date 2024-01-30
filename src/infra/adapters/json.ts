import { HttpError, HttpResponse } from '@helpers/http'
import { Response, Request } from 'express'

type MulterFiles = { [fieldname: string]: Express.Multer.File[] }
type RequestFiles = { [fieldname: string]: Express.Multer.File }

const transformFiles = (multerFiles: MulterFiles) => {
    const files: RequestFiles = {}
    for (const field in multerFiles)
        files[field] = multerFiles[field][0]
    return files
}

export function json<T extends HttpResponse>(fn: (request: any) => Promise<T>) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(req.body) ? { data: req.body } : req.body
        const files = transformFiles(req.files as MulterFiles)

        try {
            const { statusCode, data } = await fn({
                headers: req.headers,
                ...body,
                ...files,
                ...req.params,
                ...req.query,
                ...res.locals,
                ...req.middleware,
            })
            return res.status(statusCode).json({ ...data, token: data.token ?? req.params?.token })
        } catch (error) {
            console.error(`** JSON Route **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.code).json({ error: error.message })
            else if (error instanceof Error)
                return res.status(500).json({ error: 'Internal Server Error ' })
            return res.status(418).json({ error: 'how did you get here?' })
        }
    }
}
