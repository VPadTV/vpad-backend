import { HttpError } from '@plugins/http'
import { Response, Request, NextFunction } from 'express'
import { IncomingHttpHeaders } from 'http';

export type MiddlewareData = {
    headers: IncomingHttpHeaders
    authorization?: string;
    params: { [key: string]: string };
}

export function middleware(fn: (request: MiddlewareData) => Promise<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await fn({
                headers: req.headers,
                authorization: req.headers.authorization as string | undefined,
                params: req.params
            })
            req.middleware = {
                ...req.middleware,
                ...data
            }
            next()
        } catch (error) {
            console.error(`** Middleware **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.status).send({ error: error.message })
            return res.status(500).send({ error: 'Internal Server Error' })
        }
    }
}
