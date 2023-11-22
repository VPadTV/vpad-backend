import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { Database } from "@infra/gateways";
import { AdminManageBanRequest, manageBan } from "@domain/functions/admin/manageBan";
import { isLoggedIn } from "@infra/middlewares/authenticate";
import { isAdmin } from "@infra/middlewares/isAdmin";

export class AdminRoute implements IRoute {
    register(router: Router): void {
        router.use(expressMiddlewareAdapter(isAdmin))

        router.post('/ban/manage',
        expressMiddlewareAdapter(isLoggedIn),
        expressRouterAdapter(async (request: AdminManageBanRequest) => {
            return ok(await manageBan(request, Database.get()))
        }))
    }
}
