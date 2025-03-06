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
    prefix = '/series'

    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(
                seriesCreate, Database.get()))

        router.get('/:ownerId',
            route(
                seriesGet, Database.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            route(
                seriesEdit, Database.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(
                seriesDelete, Database.get()))
    }
}
