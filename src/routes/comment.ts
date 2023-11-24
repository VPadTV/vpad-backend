import { CommentCreateRequest, commentCreate } from "@domain/functions/comment/create.js";
import { CommentDeleteRequest, commentDelete } from "@domain/functions/comment/delete.js";
import { CommentEditRequest, commentEdit } from "@domain/functions/comment/edit.js";
import { CommentGetRequest, commentGet } from "@domain/functions/comment/get.js";
import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.js";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn.js";
import { ok } from "@domain/helpers/index.js";
import { Database } from "@infra/gateways/index.js";
import { IRoute } from "@main/route.js";
import { Router } from "express";

export class CommentRoute implements IRoute {
  register(router: Router): void {
    router.post('/create/:postId',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: CommentCreateRequest) => {
        return ok(await commentCreate(request, Database.get()))
      }))
    router.get('/:id',
      expressRouterAdapter(async (request: CommentGetRequest) => {
        return ok(await commentGet(request, Database.get()))
      }))
    router.put('/:id',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: CommentEditRequest) => {
        return ok(await commentEdit(request, Database.get()))
      }))
    router.delete('/:id',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: CommentDeleteRequest) => {
        return ok(await commentDelete(request, Database.get()))
      }))
  }
}
