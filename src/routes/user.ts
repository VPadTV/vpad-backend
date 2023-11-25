import { middleware, jsonResponse } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn";
import { UserGetRequest, userGet } from "@domain/functions/user/get";
import { UserLoginRequest, userLogin } from "@domain/functions/user/login";
import { UserRegisterRequest, userRegister } from "@domain/functions/user/register";
import { UserEditRequest, userEdit } from "@domain/functions/user/edit";
import { Database, Storage } from "@infra/gateways";

export class UserRoute implements IRoute {
    register(router: Router): void {
        router.post('/register',
            jsonResponse(async (request: UserRegisterRequest) => {
                return ok(await userRegister(request, Database.get()))
            }))

        router.post('/login',
            jsonResponse(async (request: UserLoginRequest) => {
                return ok(await userLogin(request, Database.get()))
            }))

        router.get('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: UserGetRequest) => {
                return ok(await userGet(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: UserEditRequest) => {
                return ok(await userEdit(request, Database.get(), Storage.get()))
            }))
    }
}
