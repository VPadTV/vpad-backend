import { VoteSetRequest, voteSet } from '@functions/vote/set';
import { ok } from 'src/plugins/http';
import { middleware, jsonResponse } from '@infra/adapters';
import { Database } from '@infra/gateways';
import { isLoggedIn } from '@infra/middlewares/isLoggedIn';
import { IRoute } from '@main/route';
import { Router } from 'express';

export class VoteRoute implements IRoute {
    register(router: Router): void {
        router.put('/:postId',
            middleware(isLoggedIn),
            jsonResponse(async (request: VoteSetRequest) => {
                return ok(await voteSet(request, Database.get()))
            }))
    }
}
