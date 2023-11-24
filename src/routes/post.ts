import { PostCreateRequest, postCreate } from "@domain/functions/post/create.js";
import { PostDeleteRequest, postDelete } from "@domain/functions/post/delete.js";
import { PostEditRequest, postEdit } from "@domain/functions/post/edit.js";
import { PostGetRequest, postGet } from "@domain/functions/post/get.js";
import { PostGetManyRequest, postGetMany } from "@domain/functions/post/getMany.js";
import { ok } from "@domain/helpers/index.js";
import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.js";
import { Database, FileStorage } from "@infra/gateways/index.js";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn.js";
import { IRoute } from "@main/route.js";
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
