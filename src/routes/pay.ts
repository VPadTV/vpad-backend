import { middleware, json } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { isLoggedIn } from "@infra/middlewares";
import { PayDonateRequest, payCreate } from "@domain/functions/pay/donate";
import { Payment } from "@infra/gateways/payment";
import { Database } from "@infra/gateways";
import { PayWebhookRequest, payWebhook } from "@domain/functions/pay/webhook";
import { raw } from "@infra/adapters/raw";

export class PayRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            json(async (request: PayDonateRequest) => {
                return ok(await payCreate(request, Database.get(), Payment.get()))
            }))

        router.post('/webhook',
            raw(async (request: PayWebhookRequest) => {
                return ok(await payWebhook(request, Database.get(), Payment.get()))
            }))
    }
}
