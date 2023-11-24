import { PostCreateRequest, postCreate } from "@domain/functions/post/create.ts";
import { PostDeleteRequest, postDelete } from "@domain/functions/post/delete.ts";
import { PostEditRequest, postEdit } from "@domain/functions/post/edit.ts";
import { PostGetRequest, postGet } from "@domain/functions/post/get.ts";
import { PostGetManyRequest, postGetMany } from "@domain/functions/post/getMany.ts";
import { ok } from "@domain/helpers/index.ts";
import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.ts";
import { Database, FileStorage } from "@infra/gateways/index.ts";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn.ts";
import { IRoute } from "@main/route.ts";
import { Router } from "express";

export class PostRoute implements IRoute {
  register(router: Router): void {
    router.post('/',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: PostCreateRequest) => {
        return ok(await postCreate(request, Database.get(), FileStorage.get()))
      }))
    router.get('/',
      expressRouterAdapter(async (request: PostGetManyRequest) => {
        return ok(await postGetMany(request, Database.get()))
      }))
    router.get('/:id',
      expressRouterAdapter(async (request: PostGetRequest) => {
        return ok(await postGet(request, Database.get()))
      }))
    router.put('/:id',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: PostEditRequest) => {
        return ok(await postEdit(request, Database.get(), FileStorage.get()))
      }))
    router.delete('/:id',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: PostDeleteRequest) => {
        return ok(await postDelete(request, Database.get(), FileStorage.get()))
      }))
  }
}
