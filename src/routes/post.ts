import { postCreate } from '@functions/post/create';
import { postDelete } from '@functions/post/delete';
import { postEdit } from '@functions/post/edit';
import { postGet } from '@functions/post/get';
import { postGetMany } from '@functions/post/getMany';
import { postStream } from '@functions/post/stream';
import { middleware, route } from '@infra/adapters';
import { streamResponse } from '@infra/adapters/streamResponse';
import { Database, Storage } from '@infra/gateways';
import { fields } from '@infra/middlewares';
import { optionalToken } from '@infra/middlewares/decodeOptionalToken';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class PostRoute implements IRoute {
    prefix = '/post'

    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            fields(['media', 'thumb']),
            route(
                postCreate, Database.get(), Storage.get()))

        router.get('/',
            middleware(optionalToken),
            route(
                postGetMany, Database.get()))

        router.get('/:id',
            middleware(optionalToken),
            route(
                postGet, Database.get()))

        router.get('/stream/:key',
            streamResponse(postStream, Storage.get()))

        router.put('/:id',
            middleware(isLoggedIn),
            route(
                postEdit, Database.get(), Storage.get()))

        router.delete('/:id',
            middleware(isLoggedIn),
            route(
                postDelete, Database.get(), Storage.get()))
    }
}
