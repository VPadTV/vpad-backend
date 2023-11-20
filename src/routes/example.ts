import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { SussyGetRequest, SussyPostRequest } from "./contracts/example";
import { sussyGet, sussyPost } from "@domain/functions/example/sussy";
import { ok } from "@domain/helpers";
import { authenticate } from "@infra/middlewares/authenticate";

export class ExampleRoute implements IRoute {
    prefix = '/example'
    register(router: Router): void {
        router.get('/sussy',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: SussyGetRequest) => {
            return ok(await sussyGet(request))
        }))

        router.post('/sussy',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: SussyPostRequest) => {
            return ok(await sussyPost(request))
        }))
    }
}
