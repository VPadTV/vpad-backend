import { middleware, json } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { ok } from '@helpers/http';
import { Database } from '@infra/gateways';
import { isLoggedIn } from '@infra/middlewares';
import { TierCreateRequest, tierCreate } from '@functions/tier/create';
import { TierUpdateRequest, tierUpdate } from '@functions/tier/update';
import { TierDeleteRequest, tierDelete } from '@functions/tier/delete';
import { TierGetManyRequest, tierGetMany } from '@functions/tier/getMany';

export class TierRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            json(async (request: TierCreateRequest) => {
                return ok(await tierCreate(request, Database.get()))
            }))

        router.get('/creator/:creatorId',
            json(async (request: TierGetManyRequest) => {
                return ok(await tierGetMany(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            json(async (request: TierUpdateRequest) => {
                return ok(await tierUpdate(request, Database.get()))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            json(async (request: TierDeleteRequest) => {
                return ok(await tierDelete(request, Database.get()))
            }))
    }
}
