import { middleware, jsonResponse } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { ok } from '@helpers/http';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { UserGetRequest, userGet } from '@functions/user/get';
import { UserLoginRequest, userLogin } from '@functions/user/login';
import { UserRegisterRequest, userRegister } from '@functions/user/register';
import { UserEditRequest, userEdit } from '@functions/user/edit';
import { Database, Storage } from '@infra/gateways';
import { fields } from '@infra/middlewares';

export class UserRoute implements IRoute {
    register(router: Router): void {
        router.post('/register',
            jsonResponse(async (request: UserRegisterRequest) => {
                return ok(await userRegister(request, Database.get()))
            }))

        router.post('/login',
            jsonResponse(async (request: UserLoginRequest) => {
                return ok(await userLogin(request, Database.get()))
            }))

        router.get('/:id',
            jsonResponse(async (request: UserGetRequest) => {
                return ok(await userGet(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            fields(['profilePhoto']),
            jsonResponse(async (request: UserEditRequest) => {
                return ok(await userEdit(request, Database.get(), Storage.get()))
            }))
    }
}
