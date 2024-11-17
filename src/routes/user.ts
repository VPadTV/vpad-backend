import { middleware, jsonResponse } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { ok } from '@plugins/http';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { userGet } from '@functions/user/get';
import { userLogin } from '@functions/user/login';
import { userRegister } from '@functions/user/register';
import { userEdit } from '@functions/user/edit';
import { Database, Storage } from '@infra/gateways';
import { fields } from '@infra/middlewares';
import { userGetMany } from '@functions/user/getMany';

export class UserRoute implements IRoute {
    register(router: Router): void {
        router.post('/register',
            jsonResponse(async (request: any) => {
                return ok(await userRegister(request, Database.get()))
            }))

        router.post('/login',
            jsonResponse(async (request: any) => {
                return ok(await userLogin(request, Database.get()))
            }))

        router.get('/',
            jsonResponse(async (request: any) => {
                return ok(await userGetMany(request, Database.get()))
            }))

        router.get('/:id',
            jsonResponse(async (request: any) => {
                return ok(await userGet(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            fields(['profilePhoto']),
            jsonResponse(async (request: any) => {
                return ok(await userEdit(request, Database.get(), Storage.get()))
            }))
    }
}
