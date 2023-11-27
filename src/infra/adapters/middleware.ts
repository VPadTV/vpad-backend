import { HttpError } from '@domain/helpers/errors'
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
            req.params = {
                ...req.params,
                ...data
            }
            next()
        } catch (error) {
            console.error(`** Middleware **`)
            console.error(error)
            if (error instanceof HttpError)
                return res.status(error.code).json({ error: error.message })
            return res.status(500).json({ error: error.code ?? error.message })
        }
    }
}
