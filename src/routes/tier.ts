import { middleware, route } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { Database } from '@infra/gateways';
import { isLoggedIn } from '@infra/middlewares';
import { tierCreate } from '@functions/tier/create';
import { tierUpdate } from '@functions/tier/update';
import { tierDelete } from '@functions/tier/delete';
import { tierGetMany } from '@functions/tier/getMany';

export class TierRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await tierCreate(request, Database.get())
            }))

        router.get('/creator/:creatorId',
            route(async (request: any) => {
                return await tierGetMany(request, Database.get())
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await tierUpdate(request, Database.get())
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await tierDelete(request, Database.get())
            }))
    }
}
