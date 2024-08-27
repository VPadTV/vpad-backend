import { middleware, jsonResponse } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { ok } from '@plugins/http';
import { Database } from '@infra/gateways';
import { subCreate } from '@functions/sub/create';
import { subDelete } from '@functions/sub/delete';
import { isLoggedIn } from '@infra/middlewares';
import { subGet } from '@functions/sub/get';

export class SubRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await subCreate(request, Database.get()))
            }))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await subGet(request, Database.get()))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await subDelete(request, Database.get()))
            }))
    }
}
