import { Response, Request, NextFunction } from 'express'
import { IncomingHttpHeaders } from 'http';
import { handleError } from './handleError';

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
                authorization: req.headers.authorization,
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
            const httpErr = handleError(error)
            return res.status(httpErr.status).send({ error: httpErr.message })
        }
    }
}
