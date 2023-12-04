import { PostCreateRequest, postCreate } from "@domain/functions/post/create";
import { PostDeleteRequest, postDelete } from "@domain/functions/post/delete";
import { PostEditRequest, postEdit } from "@domain/functions/post/edit";
import { PostGetRequest, postGet } from "@domain/functions/post/get";
import { PostGetManyRequest, postGetMany } from "@domain/functions/post/getMany";
import { PostStreamRequest, postStream } from "@domain/functions/post/stream";
import { ok } from "@domain/helpers";
import { middleware, json } from "@infra/adapters";
import { streamResponse } from "@infra/adapters/streamResponse";
import { Database, Storage } from "@infra/gateways";
import { fields } from "@infra/middlewares";
import { optionalToken } from "@infra/middlewares/decodeOptionalToken";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn";
import { IRoute } from "@main/route";
import { Router } from "express";

export class PostRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            fields(['media', 'thumb']),
            json(async (request: PostCreateRequest) => {
                return ok(await postCreate(request, Database.get(), Storage.get()))
            }))
        router.get('/',
            middleware(optionalToken),
            json(
                async (request: PostGetManyRequest) => {
                    return ok(await postGetMany(request, Database.get()))
                }))
        router.get('/:id',
            json(async (request: PostGetRequest) => {
                return ok(await postGet(request, Database.get()))
            }))
        router.get('/stream/:key',
            streamResponse(async (request: PostStreamRequest) => {
                return postStream(request, Storage.get())
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            json(async (request: PostEditRequest) => {
                return ok(await postEdit(request, Database.get(), Storage.get()))
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            json(async (request: PostDeleteRequest) => {
                return ok(await postDelete(request, Database.get(), Storage.get()))
            }))
    }
}
