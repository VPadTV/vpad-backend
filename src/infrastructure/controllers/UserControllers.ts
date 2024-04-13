import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { middleware } from '@middlewares/middleware';
import { fields } from '@middlewares/files';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { jsonResponse } from '@plugins/jsonResponse';
import { ok } from '@plugins/responses';
import { UserUseCase } from '@domain/use-cases/UserUseCase';

export class UserControllers implements IController {
    constructor(private readonly userUseCase: UserUseCase) { }
    register(router: Router): void {
        router.post(
            '/register',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.registerUser(req));
            }),
        );

        router.get(
            '/:id',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.getUserById(req));
            }),
        );

        router.put(
            '/:id',
            middleware(isLoggedIn),
            fields(['profilePhoto']),
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.updateUser(req));
            }),
        );

        router.post(
            '/login',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.loginUser(req));
            }),
        );

        router.get(
            '/admin',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.getUsers(req));
            }),
        );

        router.put(
            '/ban:id',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.manageBan(req));
            }),
        );

        router.put(
            '/admin/:id',
            jsonResponse(async (req) => {
                return ok(await this.userUseCase.getUserById(req));
            }),
        );
    }
}
