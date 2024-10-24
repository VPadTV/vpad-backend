import { PayWebhookRequest } from '@functions/pay/webhook'
import { Response, Request } from 'express'
import { IncomingHttpHeaders } from 'http'

export type RawRequest = {
    headers: IncomingHttpHeaders,
    body: any,
    [key: string]: any,
}

export function webhook(fn: (request: PayWebhookRequest) => Promise<void>) {
    return async (req: Request, res: Response) => {
        await fn({
            signature: req.headers['stripe-signature'] as string | undefined,
            raw: req.body,
        })
        return res.status(200).send()
    }
}
