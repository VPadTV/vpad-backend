import { middleware, route } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { Database } from '@infra/gateways';
import { subCreate } from '@functions/sub/create';
import { subDelete } from '@functions/sub/delete';
import { isLoggedIn } from '@infra/middlewares';
import { subGet } from '@functions/sub/get';

export class SubRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await subCreate(request, Database.get())
            }))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await subGet(request, Database.get())
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await subDelete(request, Database.get())
            }))
    }
}
