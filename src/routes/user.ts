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
import { userGetMany } from '@functions/user/getMany';
import { userWhoAmI } from '@functions/user/loggedIn';

export class UserRoute implements IRoute {
    prefix = '/user'

    register(router: Router): void {
        router.post('/register',
            route(userRegister, Database.get()))

        router.post('/login',
            route(
                userLogin, Database.get()))

        router.get('/',
            route(
                userGetMany, Database.get()))

        router.get('/whoami',
            middleware(isLoggedIn),
            route(
                userWhoAmI, Database.get()))

        router.get('/:id',
            route(
                userGet, Database.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            fields(['profilePhoto']),
            route(
                userEdit, Database.get(), Storage.get()))
    }
}
