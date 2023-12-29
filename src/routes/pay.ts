import { middleware, json } from "@infra/adapters";
import { IRoute } from "@main/route";
import express, { Router } from "express";
import { ok } from "@domain/helpers";
import { isLoggedIn } from "@infra/middlewares";
import { PayDonateRequest, payCreate } from "@domain/functions/pay/donate";
import { Payment } from "@infra/gateways/payment";
import { Database } from "@infra/gateways";
import { PayWebhookRequest, payWebhook } from "@domain/functions/pay/webhook";
import { webhook } from "@infra/adapters/webhook";

export class PayRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            json(async (request: PayDonateRequest) => {
                return ok(await payCreate(request, Database.get(), Payment.get()))
            }))

        router.post('/webhook',
            express.raw({ type: 'application/json' }),
            webhook(async (request: PayWebhookRequest) => {
                await payWebhook(request, Database.get(), Payment.get())
            }))
    }
}
