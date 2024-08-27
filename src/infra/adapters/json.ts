import { badRequest, Errors, HttpError, HttpResponse } from '@plugins/http'
import { Response, Request } from 'express'
import { parseBody } from "@infra/middlewares/parseBody";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

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
            let { statusCode, data } = await fn({
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
            return res.status(statusCode).json({ ...data, token: data.token ?? req.params?.token })
        } catch (error) {
            console.error(`** JSON Route **`)
            console.error(error)
            const httpErr = handleError(error)
            return res.status(httpErr.status).send({ error: httpErr.message })
        }
    }
}

function handleError(error: unknown): HttpError {
    if (error instanceof HttpError)
        return error

    else if (error instanceof PrismaClientKnownRequestError) {
        return badRequest(error.meta?.cause as string ?? error.name)
    }

    else if (error instanceof PrismaClientValidationError) {
        const match = /.*\n\n(.*)\.$/.exec(error.message)
        if (!match) return badRequest(error.name)
        return badRequest(match[1])
    }

    else if (error instanceof PrismaClientUnknownRequestError) {
        return badRequest(error.name)
    }

    return Errors.INTERNAL_SERVER_ERROR()
}