import { middleware, json } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { ok } from '@helpers/http';
import { Database } from '@infra/gateways';
import { SubCreateRequest, subCreate } from '@functions/sub/create';
import { SubUpdateRequest, subUpdate } from '@functions/sub/update';
import { SubDeleteRequest, subDelete } from '@functions/sub/delete';
import { isLoggedIn } from '@infra/middlewares';
import { SubGetRequest, subGet } from '@functions/sub/get';

export class SubRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            json(async (request: SubCreateRequest) => {
                return ok(await subCreate(request, Database.get()))
            }))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            json(async (request: SubGetRequest) => {
                return ok(await subGet(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            json(async (request: SubUpdateRequest) => {
                return ok(await subUpdate(request, Database.get()))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            json(async (request: SubDeleteRequest) => {
                return ok(await subDelete(request, Database.get()))
            }))
    }
}
