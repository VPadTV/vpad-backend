import { postCreate } from '@functions/post/create';
import { postDelete } from '@functions/post/delete';
import { postEdit } from '@functions/post/edit';
import { postGet } from '@functions/post/get';
import { postGetMany } from '@functions/post/getMany';
import { PostStreamRequest, postStream } from '@functions/post/stream';
import { ok } from '@plugins/http';
import { middleware, jsonResponse } from '@infra/adapters';
import { streamResponse } from '@infra/adapters/streamResponse';
import { Database, Storage } from '@infra/gateways';
import { fields } from '@infra/middlewares';
import { optionalToken } from '@infra/middlewares/decodeOptionalToken';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class PostRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            fields(['media', 'thumb']),
            jsonResponse(async (request: any) => {
                return ok(await postCreate(request, Database.get(), Storage.get()))
            }))
        router.get('/',
            middleware(optionalToken),
            jsonResponse(async (request: any) => {
                return ok(await postGetMany(request, Database.get()))
            }))
        router.get('/:id',
            middleware(optionalToken),
            jsonResponse(async (request: any) => {
                return ok(await postGet(request, Database.get()))
            }))
        router.get('/stream/:key',
            streamResponse(async (request: PostStreamRequest) => {
                return postStream(request, Storage.get())
            }))
        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await postEdit(request, Database.get(), Storage.get()))
            }))
        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any) => {
                return ok(await postDelete(request, Database.get(), Storage.get()))
            }))
    }
}
