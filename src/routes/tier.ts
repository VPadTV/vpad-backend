import { middleware, jsonResponse } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { Database } from "@infra/gateways";
import { isLoggedIn } from "@infra/middlewares";
import { TierCreateRequest, tierCreate } from "@domain/functions/tier/create";
import { TierUpdateRequest, tierUpdate } from "@domain/functions/tier/update";
import { TierDeleteRequest, tierDelete } from "@domain/functions/tier/delete";
import { TierGetManyRequest, tierGetMany } from "@domain/functions/tier/getMany";

export class TierRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            jsonResponse(async (request: TierCreateRequest) => {
                return ok(await tierCreate(request, Database.get()))
            }))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            jsonResponse(async (request: TierGetManyRequest) => {
                return ok(await tierGetMany(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: TierUpdateRequest) => {
                return ok(await tierUpdate(request, Database.get()))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: TierDeleteRequest) => {
                return ok(await tierDelete(request, Database.get()))
            }))
    }
}
