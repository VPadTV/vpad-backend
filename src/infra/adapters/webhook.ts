import { PayWebhookRequest } from '@domain/functions/pay/webhook'
import { HttpError } from '@domain/helpers'
import { Response, Request } from 'express'
import { IncomingHttpHeaders } from 'http'

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
            if (error instanceof HttpError)
                return res.status(error.code).json({ error: error.message })
            return res.status(500).json({ error: error.code ?? error.message })
        }
    }
}
