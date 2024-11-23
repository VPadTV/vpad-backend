import { middleware, jsonResponse } from '@infra/adapters';
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
            jsonResponse(
                tierCreate, Database.get()))

        router.get('/creator/:creatorId',
            jsonResponse(
                tierGetMany, Database.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(
                tierUpdate, Database.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(
                tierDelete, Database.get()))
    }
}
