import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { middleware } from '@middlewares/middleware';
import { jsonResponse } from '@plugins/jsonResponse';
import { ok } from '@plugins/responses';
import { SubUseCase } from '@domain/use-cases/SubUseCase';

export class SubControllers implements IController {
    constructor(private readonly SubUseCase: SubUseCase) { }
    register(router: Router): void {
        router.post(
            '/create',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.SubUseCase.createSub(req));
            }),
        );

        router.get(
            '/:creatorId',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.SubUseCase.getAllSubs(req));
            }),
        );

        router.put(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.SubUseCase.updateSub(req));
            }),
        );

        router.delete(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.SubUseCase.deleteSub(req));
            }),
        );
    }
}
