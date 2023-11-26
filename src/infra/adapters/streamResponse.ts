import { PostStreamResponse } from '@domain/functions/post/stream'
import { HttpError } from '@domain/helpers'
import { Response, Request } from 'express'

export function streamResponse<T, U extends PostStreamResponse>(fn: (request: T) => Promise<U>) {
    return async (req: Request, res: Response) => {
        try {
            const {
                stream,
                ContentLength,
                ContentType,
            } = await fn({
                ...req.params,
                ...req.query,
                ...res.locals,
            } as T)
            res.writeHead(200, {
                'Content-Length': ContentLength,
                'Content-Type': ContentType,
            })
            const streaming = stream.pipe(res)
            streaming.on('close', () => {
                res.end()
            })
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
