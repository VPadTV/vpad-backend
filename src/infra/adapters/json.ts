import { Errors, HttpError, HttpResponse } from 'src/plugins/http'
import { Response, Request } from 'express'
import { parseBody } from "@infra/middlewares/parseBody";

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
        const body = Array.isArray(req.body) ? { data: req.body } : req.body
        const files = transformFiles(req.files as MulterFiles)

        try {
            const { statusCode, data } = await fn({
                headers: req.headers,
                ...files,
                ...parseBody({
                    ...body,
                    ...req.params,
                    ...req.query,
                }),
                ...req.middleware,
            })
            return res.status(statusCode).json({ ...data, token: data.token ?? req.params?.token })
        } catch (error) {
            console.error(`** JSON Route **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.status).send({ error: error.message })
            const serverError = Errors.INTERNAL_SERVER_ERROR()
            return res.status(serverError.status).send({ error: serverError.message })
        }
    }
}
