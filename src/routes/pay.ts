import { middleware, jsonResponse } from '@infra/adapters';
import { IRoute } from '@main/route';
import express, { Router } from 'express';
import { isLoggedIn } from '@infra/middlewares';
import { DonateRequest, donateCreate } from '@functions/pay/donate';
import { Payment } from '@infra/gateways/payment';
import { Database } from '@infra/gateways';
import { PayWebhookRequest, payWebhook } from '@functions/pay/webhook';
import { ok } from '@plugins/http';
import { webhook } from '@infra/adapters/webhook';

export class PayRoute implements IRoute {
    register(router: Router): void {
        router.post('/donate',
            middleware(isLoggedIn),
            jsonResponse(async (request: DonateRequest) => {
                return ok(await donateCreate(request, Database.get(), Payment.get()))
            }))

        router.post('/webhook',
            express.raw({ type: 'application/json' }),
            webhook(async (request: PayWebhookRequest) => {
                await payWebhook(request, Database.get(), Payment.get())
            }))
    }
}
