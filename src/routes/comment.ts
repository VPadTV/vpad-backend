import { CommentCreateRequest, commentCreate } from '@functions/comment/create';
import { CommentDeleteRequest, commentDelete } from '@functions/comment/delete';
import { CommentEditRequest, commentEdit } from '@functions/comment/edit';
import { CommentGetRequest, commentGet } from '@functions/comment/get';
import { middleware, jsonResponse } from '@infra/adapters';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { ok } from '@plugins/http';
import { Database } from '@infra/gateways';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class CommentRoute implements IRoute {
    register(router: Router): void {
        router.post('/create/:postId',
            middleware(isLoggedIn),
            jsonResponse(async (request: CommentCreateRequest) => {
                return ok(await commentCreate(request, Database.get()))
            }))
        router.get('/:id',
            jsonResponse(async (request: CommentGetRequest) => {
                return ok(await commentGet(request, Database.get()))
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: CommentEditRequest) => {
                return ok(await commentEdit(request, Database.get()))
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: CommentDeleteRequest) => {
                return ok(await commentDelete(request, Database.get()))
            }))
    }
}
