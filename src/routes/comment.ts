import { commentCreate } from '@functions/comment/create';
import { commentDelete } from '@functions/comment/delete';
import { commentEdit } from '@functions/comment/edit';
import { commentGet } from '@functions/comment/get';
import { middleware, route } from '@infra/adapters';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { Database } from '@infra/gateways';
import { IRoute } from '@main/route';
import { Router } from 'express';
import { commentGetMany } from '@functions/comment/getMany';

export class CommentRoute implements IRoute {
    prefix = '/comment'

    register(router: Router): void {
        router.post('/create/:postId',
            middleware(isLoggedIn),
            route(commentCreate, Database.get()))

        router.get('/:id',
            route(commentGet, Database.get()))

        router.get('/',
            route(
                commentGetMany, Database.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            route(commentEdit, Database.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(
                commentDelete, Database.get()))
    }
}
