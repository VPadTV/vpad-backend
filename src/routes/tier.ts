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
    prefix = '/tier'

    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            route(
                tierCreate, Database.get()))

        router.get('/creator/:creatorId',
            route(
                tierGetMany, Database.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            route(
                tierUpdate, Database.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(
                tierDelete, Database.get()))
    }
}
