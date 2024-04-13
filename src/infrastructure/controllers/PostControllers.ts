import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { ok } from '@plugins/responses';
import { jsonResponse } from '@plugins/jsonResponse';
import { middleware } from '@middlewares/middleware';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { PostUseCase } from '@domain/use-cases/PostUseCase';

export class PostControllers implements IController {
    constructor(private readonly postUseCase: PostUseCase) { }
    register(router: Router): void {
        router.post(
            '/create',
            jsonResponse(async (req) => {
                return ok(await this.postUseCase.createPost(req));
            }),
        );

        router.get(
            '/:id',
            jsonResponse(async (req) => {
                return ok(await this.postUseCase.getPostById(req));
            }),
        );

        router.put(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.postUseCase.updatePost(req));
            }),
        );

        router.delete(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.postUseCase.deletePost(req));
            }),
        );

        router.put(
            'vote/:id',
            middleware(isLoggedIn),
            jsonResponse(async (req) => {
                return ok(await this.postUseCase.voteSet(req));
            }),
        );
    }
}
