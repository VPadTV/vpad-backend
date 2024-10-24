import { Request, NextFunction } from 'express'

export type MiddlewareData = {
    authorization: string;
    params: { [key: string]: string };
}

export function middleware(fn: (request: MiddlewareData) => Promise<any>) {
    return async (req: Request, _: any, next: NextFunction) => {
        const data = await fn({
            authorization: req.headers.authorization as string,
            params: req.params
        })
        req.middleware = {
            ...req.middleware,
            ...data
        }
        next()
    }
}
