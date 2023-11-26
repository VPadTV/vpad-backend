import { HttpError } from '@domain/helpers'
import { StreamResponse } from '@infra/gateways'
import { Response, Request } from 'express'

export function streamResponse<T, U extends StreamResponse>(fn: (request: T) => Promise<U>) {
    return async (req: Request, res: Response) => {
        const body = Array.isArray(req.body) ? { data: req.body } : req.body

        try {
            const {
                stream,
                ContentLength,
                ContentType,
            } = await fn({
                ...body,
                ...req.params,
                ...req.query,
                ...res.locals,
            })
            res.writeHead(200, {
                'Content-Length': ContentLength, // Get the video file size,
                'Content-Type': ContentType,
            })
            stream.pipe(res)
        } catch (error) {
            console.error(`<StreamRouteError>: ${error?.message}`)
            console.log(error)
            if (error instanceof HttpError) {
                return res.status(error.code).json({ error: error.message })
            }
            return res.status(500).json({ error })
        }
    }
}
