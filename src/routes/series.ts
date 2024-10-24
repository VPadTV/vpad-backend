import { middleware, route } from '@infra/adapters';
import { Database } from '@infra/gateways';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { seriesCreate } from '@functions/series/create';
import { seriesGet } from '@functions/series/get';
import { seriesEdit } from '@functions/series/edit';
import { seriesDelete } from '@functions/series/delete';

export class SeriesRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await seriesCreate(request, Database.get())
            }))
        router.get('/:ownerId',
            route(async (request: any) => {
                return await seriesGet(request, Database.get())
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await seriesEdit(request, Database.get())
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await seriesDelete(request, Database.get())
            }))
    }
}
