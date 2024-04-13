import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { jsonResponse } from '@plugins/jsonResponse';
import { ok } from '@plugins/responses';
import { middleware } from '@middlewares/middleware';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { CommentUseCase } from '@domain/use-cases/CommentUseCase';

export class CommentControllers implements IController {
    constructor(private readonly commentUseCase: CommentUseCase) { }
    register(router: Router): void {
        router.post(
            '/create',
            jsonResponse(async (req) => {
                return ok(await this.commentUseCase.createComment(req));
            }),
        );

        router.get(
            '/:id',
            jsonResponse(async (req) => {
                return ok(await this.commentUseCase.getCommentById(req));
            }),
        );

        router.put(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.commentUseCase.updateComment(req));
            }),
        );

        router.delete(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.commentUseCase.deleteComment(req));
            }),
        );
    }
}
