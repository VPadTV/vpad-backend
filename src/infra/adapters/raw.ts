import { HttpError, HttpResponse } from '@domain/helpers'
import { Response, Request } from 'express'
import { IncomingHttpHeaders } from 'http'

export type RawRequest = {
    headers: IncomingHttpHeaders,
    body: any,
    [key: string]: any,
}

export function raw<T extends HttpResponse>(fn: (request: any) => Promise<T>) {
    return async (req: Request, res: Response) => {
        try {
            const { statusCode, data } = await fn({
                headers: req.headers,
                body: req.body,
                ...req.params,
                ...req.query,
                ...res.locals,
            })
            return res.status(statusCode).json({ ...data })
        } catch (error) {
            console.error(`** Raw Route **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.code).json({ error: error.message })
            return res.status(500).json({ error: error.code ?? error.message })
        }
    }
}
