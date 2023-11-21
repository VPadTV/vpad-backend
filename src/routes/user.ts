import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { authenticate } from "@infra/middlewares/authenticate";
import { GetUserByIdRequest, getUserById } from "@domain/functions/user/getById";

export class UserRoute implements IRoute {
    prefix = '/user'
    register(router: Router): void {
        router.get('/get/:id',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: GetUserByIdRequest) => {
            return ok(await getUserById(request))
        }))
    }
}
