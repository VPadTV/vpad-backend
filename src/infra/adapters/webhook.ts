import { PayWebhookRequest } from '@functions/pay/webhook'
import { Response, Request } from 'express'
import { IncomingHttpHeaders } from 'http'
import { handleError } from './handleError'

export type RawRequest = {
    headers: IncomingHttpHeaders,
    body: any,
    [key: string]: any,
}

export function webhook(fn: (request: PayWebhookRequest) => Promise<void>) {
    return async (req: Request, res: Response) => {
        try {
            await fn({
                signature: req.headers['stripe-signature'] as string | undefined,
                raw: req.body,
            })
            return res.status(200).send()
        } catch (error) {
            console.error(`** Webhook Route **`)
            console.error(error)
            const httpErr = handleError(error)
            return res.status(httpErr.status).send({ error: httpErr.message })
        }
    }
}
