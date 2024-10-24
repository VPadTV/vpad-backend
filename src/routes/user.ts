import { middleware, route } from '@infra/adapters';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { userGet } from '@functions/user/get';
import { userLogin } from '@functions/user/login';
import { userRegister } from '@functions/user/register';
import { userEdit } from '@functions/user/edit';
import { Database, Storage } from '@infra/gateways';
import { fields } from '@infra/middlewares';
import { Payment } from '@infra/gateways/payment';

export class UserRoute implements IRoute {
    register(router: Router): void {
        router.post('/register',
            route(async (request: any) => {
                return await userRegister(request, Database.get(), Payment.get())
            }))

        router.post('/login',
            route(async (request: any) => {
                return await userLogin(request, Database.get())
            }))

        router.get('/:id',
            route(async (request: any) => {
                return await userGet(request, Database.get())
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            fields(['profilePhoto']),
            route(async (request: any) => {
                return await userEdit(request, Database.get(), Storage.get())
            }))
    }
}
