import { CommentCreateRequest, commentCreate } from "@domain/functions/comment/create";
import { CommentDeleteRequest, commentDelete } from "@domain/functions/comment/delete";
import { CommentEditRequest, commentEdit } from "@domain/functions/comment/edit";
import { CommentGetRequest, commentGet } from "@domain/functions/comment/get";
import { ok } from "@domain/helpers";
import { expressRouterAdapter } from "@infra/adapters";
import { Database } from "@infra/gateways";
import { IRoute } from "@main/route";
import { Router } from "express";

export class CommentRoute implements IRoute {
  register(router: Router): void {
    router.post('/create/:postId',
      expressRouterAdapter(async (request: CommentCreateRequest) => {
        return ok(commentCreate(request, Database.get()))
      }))
    router.get('/:id',
      expressRouterAdapter(async (request: CommentGetRequest) => {
        return ok(commentGet(request, Database.get()))
      }))
    router.put('/:id',
      expressRouterAdapter(async (request: CommentEditRequest) => {
        return ok(commentEdit(request, Database.get()))
      }))
    router.delete('/:id',
      expressRouterAdapter(async (request: CommentDeleteRequest) => {
        return ok(commentDelete(request, Database.get()))
      }))
  }
}
