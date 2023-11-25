import { PostCreateRequest, postCreate } from "@domain/functions/post/create";
import { PostDeleteRequest, postDelete } from "@domain/functions/post/delete";
import { PostEditRequest, postEdit } from "@domain/functions/post/edit";
import { PostGetRequest, postGet } from "@domain/functions/post/get";
import { PostGetManyRequest, postGetMany } from "@domain/functions/post/getMany";
import { ok } from "@domain/helpers";
import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { Database, Storage } from "@infra/gateways";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn";
import { IRoute } from "@main/route";
import { Router } from "express";

export class PostRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            expressMiddlewareAdapter(isLoggedIn),
            expressRouterAdapter(async (request: PostCreateRequest) => {
                return ok(await postCreate(request, Database.get(), Storage.get()))
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
                return ok(await postEdit(request, Database.get(), Storage.get()))
            }))
        router.delete('/:id',
            expressMiddlewareAdapter(isLoggedIn),
            expressRouterAdapter(async (request: PostDeleteRequest) => {
                return ok(await postDelete(request, Database.get(), Storage.get()))
            }))
    }
}
