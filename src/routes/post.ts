import { PostCreateRequest, postCreate } from "@domain/functions/post/create";
import { PostDeleteRequest, postDelete } from "@domain/functions/post/delete";
import { PostEditRequest, postEdit } from "@domain/functions/post/edit";
import { PostGetRequest, postGet } from "@domain/functions/post/get";
import { ok } from "@domain/helpers";
import { expressRouterAdapter } from "@infra/adapters";
import { Database, FileStorage } from "@infra/gateways";
import { IRoute } from "@main/route";
import { Router } from "express";

export class PostRoute implements IRoute {
  register(router: Router): void {
    router.post('/',
      expressRouterAdapter(async (request: PostCreateRequest) => {
        return ok(postCreate(request, Database.get(), FileStorage.get()))
      }))
    router.get('/:id',
      expressRouterAdapter(async (request: PostGetRequest) => {
        return ok(postGet(request, Database.get()))
      }))
    router.put('/:id',
      expressRouterAdapter(async (request: PostEditRequest) => {
        return ok(postEdit(request, Database.get(), FileStorage.get()))
      }))
    router.delete('/:id',
      expressRouterAdapter(async (request: PostDeleteRequest) => {
        return ok(postDelete(request, Database.get(), FileStorage.get()))
      }))
  }
}
