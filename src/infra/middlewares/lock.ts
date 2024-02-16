import { boolify } from "@helpers/boolify"
import { Errors } from "@helpers/http"
import type { Request, Response, NextFunction } from 'express'

export const lockServer = (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLowerCase() === 'get' || boolify(process.env.OPEN_FOR_POST)) {
        next()
    } else {
        const err = Errors.SERVER_READ_ONLY()
        res.status(err.status).send({ error: err.message })
    }
}
export const lockRoute = (_req: Request, res: Response) => {
    const err = Errors.ROUTE_LOCKED()
    res.status(err.status).send({ error: err.message })
}