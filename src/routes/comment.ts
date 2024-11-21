import { commentCreate } from '@functions/comment/create';
import { commentDelete } from '@functions/comment/delete';
import { commentEdit } from '@functions/comment/edit';
import { commentGet } from '@functions/comment/get';
import { middleware, jsonResponse } from '@infra/adapters';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { ok } from '@plugins/http';
import { Database } from '@infra/gateways';
import { IRoute } from '@main/route';
import { Router } from 'express';
import {commentGetMany} from "@functions/comment/getMany";

export class CommentRoute implements IRoute {
    register(router: Router): void {
        router.get('/', jsonResponse(async (request: any) => {
					return ok(await commentGetMany(request, Database.get()))
				}))
        router.post('/create/:postId',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await commentCreate(request, Database.get()))
            }))
        router.get('/:id',
            jsonResponse(async (request: any) => {
                return ok(await commentGet(request, Database.get()))
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await commentEdit(request, Database.get()))
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await commentDelete(request, Database.get()))
            }))
    }
}
