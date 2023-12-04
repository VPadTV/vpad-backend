import { CommentCreateRequest, commentCreate } from "@domain/functions/comment/create";
import { CommentDeleteRequest, commentDelete } from "@domain/functions/comment/delete";
import { CommentEditRequest, commentEdit } from "@domain/functions/comment/edit";
import { CommentGetRequest, commentGet } from "@domain/functions/comment/get";
import { middleware, json } from "@infra/adapters";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn";
import { ok } from "@domain/helpers";
import { Database } from "@infra/gateways";
import { IRoute } from "@main/route";
import { Router } from "express";

export class CommentRoute implements IRoute {
    register(router: Router): void {
        router.post('/create/:postId',
            middleware(isLoggedIn),
            json(async (request: CommentCreateRequest) => {
                return ok(await commentCreate(request, Database.get()))
            }))
        router.get('/:id',
            json(async (request: CommentGetRequest) => {
                return ok(await commentGet(request, Database.get()))
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            json(async (request: CommentEditRequest) => {
                return ok(await commentEdit(request, Database.get()))
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            json(async (request: CommentDeleteRequest) => {
                return ok(await commentDelete(request, Database.get()))
            }))
    }
}
