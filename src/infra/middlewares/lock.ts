import { boolify } from "@helpers/boolify"
import type { Request, Response, NextFunction } from 'express'

export const lockServer = (error: string = 'Server is read-only right now') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.method.toLowerCase() === 'get' || boolify(process.env.OPEN_FOR_POST)) {
            next()
        } else {
            res.status(401).send({ error })
        }
    }
}
export const lockRoute = (error: string = 'Route blocked') => {
    return (_req: Request, res: Response) => {
        res.status(401).send({ error })
    }
}