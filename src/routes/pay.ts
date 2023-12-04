import { middleware, jsonResponse } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { isLoggedIn } from "@infra/middlewares";
import { PayCreateRequest, payCreate } from "@domain/functions/pay/create";
import { Payment } from "@infra/gateways/payment";
import { Database } from "@infra/gateways";

export class PayRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            jsonResponse(async (request: PayCreateRequest) => {
                return ok(await payCreate(request, Database.get(), Payment.get()))
            }))
    }
}
