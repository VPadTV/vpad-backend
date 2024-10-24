import { middleware, route } from '@infra/adapters';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { Database } from '@infra/gateways';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { commCreate } from '@functions/commission/create';
import { commGetMany } from '@functions/commission/getMany';
import { commDelete } from '@functions/commission/delete';

export class CommissionRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await commCreate(request, Database.get())
            }))
        router.get('/:id',
            route(async (request: any) => {
                return await commGetMany(request, Database.get())
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await commDelete(request, Database.get())
            }))
    }
}
