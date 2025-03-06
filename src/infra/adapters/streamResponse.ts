import { PostStreamResponse } from '@functions/post/stream'
import { Response, Request } from 'express'
import { handleError } from './handleError'

export function streamResponse<U extends PostStreamResponse>(fn: (request: any, ...args: any[]) => Promise<U>, ...args: any[]) {
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
            }, ...args)
            res.writeHead(200, {
                'Content-Length': ContentLength,
                'Content-Type': ContentType,
            })
            const streaming = stream.pipe(res)
            streaming.on('close', () => {
                res.end()
            })
        } catch (error) {
            console.error(error)
            const httpErr = handleError(error)
            return res.status(httpErr.status).send({ error: httpErr.message })
        }
    }
}
