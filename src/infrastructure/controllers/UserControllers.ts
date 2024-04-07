import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { middleware } from '@middlewares/middleware';
import { fields } from '@middlewares/files';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { jsonResponse } from '@plugins/jsonResponse';
import { ok } from '@plugins/responses';
import { UserUseCase } from '@domain/use-cases/UserUseCase';

export class UserControllers implements IController {
	constructor(private readonly userUseCase: UserUseCase) {}
	register(router: Router): void {
		router.post(
			'/register',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.registerUser(request));
			}),
		);

		router.get(
			'/:id',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.getUserById(request));
			}),
		);

		router.put(
			'/:id',
			middleware(isLoggedIn),
			fields(['profilePhoto']),
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.updateUser(request));
			}),
		);

		router.post(
			'/login',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.loginUser(request));
			}),
		);

		router.get(
			'/admin',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.getUsers(request));
			}),
		);

		router.put(
			'/ban:id',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.manageBan(request));
			}),
		);

		router.put(
			'/admin/:id',
			jsonResponse(async (request: any) => {
				return ok(await this.userUseCase.getUserById(request));
			}),
		);
	}
}
