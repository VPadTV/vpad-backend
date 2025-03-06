import { voteSet } from '@functions/vote/set';
import { middleware, route } from '@infra/adapters';
import { Database } from '@infra/gateways';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class VoteRoute implements IRoute {
    prefix = '/vote'

    register(router: Router): void {
        router.put('/:postId',
            middleware(isLoggedIn),
            route(voteSet, Database.get()))
    }
}
