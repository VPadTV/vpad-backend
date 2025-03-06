import { middleware, route } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { Database } from '@infra/gateways';
import { subCreate } from '@functions/sub/create';
import { subDelete } from '@functions/sub/delete';
import { isLoggedIn } from '@infra/middlewares';
import { subGet } from '@functions/sub/get';

export class SubRoute implements IRoute {
    prefix = '/sub'

    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(
                subCreate, Database.get()))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            route(
                subGet, Database.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(
                subDelete, Database.get()))
    }
}
