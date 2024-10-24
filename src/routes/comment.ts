import { commentCreate } from '@functions/comment/create';
import { commentDelete } from '@functions/comment/delete';
import { commentEdit } from '@functions/comment/edit';
import { commentGet } from '@functions/comment/get';
import { middleware, route } from '@infra/adapters';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { Database } from '@infra/gateways';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class CommentRoute implements IRoute {
    register(router: Router): void {
        router.post('/create/:postId',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await commentCreate(request, Database.get())
            }))
        router.get('/:id',
            route(async (request: any) => {
                return await commentGet(request, Database.get())
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await commentEdit(request, Database.get())
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            route(async (request: any) => {
                return await commentDelete(request, Database.get())
            }))
    }
}
