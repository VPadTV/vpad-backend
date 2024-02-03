import { HttpError } from '@helpers/http'
import { Response, Request, NextFunction } from 'express'

export type MiddlewareData = {
    authorization: string;
    params: { [key: string]: string };
}

export function middleware(fn: (request: MiddlewareData) => Promise<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await fn({
                authorization: req.headers.authorization as string,
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
                return res.status(error.code).send({ error: error.message })
            else if (error instanceof Error)
                return res.status(500).send({ error: 'Internal Server Error' })
            return res.status(418).send({ error: 'how did you get here?' })
        }
    }
}
