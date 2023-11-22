import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { isLoggedIn } from "@infra/middlewares/authenticate";
import { UserGetByIdRequest, userGet } from "@domain/functions/user/get";
import { UserLoginRequest, userLogin } from "@domain/functions/user/login";
import { UserRegisterRequest, userRegister } from "@domain/functions/user/register";
import { UserEditRequest, userEdit } from "@domain/functions/user/edit";
import { Database, FileStorage } from "@infra/gateways";
import { privateInfo } from "@infra/middlewares/privateInfo";

export class UserRoute implements IRoute {
    register(router: Router): void {
        router.post('/register',
        expressRouterAdapter(async (request: UserRegisterRequest) => {
            return ok(await userRegister(request, Database.get()))
        }))

        router.post('/login',
        expressRouterAdapter(async (request: UserLoginRequest) => {
            return ok(await userLogin(request, Database.get()))
        }))
        
        router.get('/:id',
        expressMiddlewareAdapter(isLoggedIn),
        expressRouterAdapter(async (request: UserGetByIdRequest) => {
            return ok(await userGet(request, Database.get()))
        }))

        router.put('/:id',
        expressMiddlewareAdapter(privateInfo),
        expressRouterAdapter(async (request: UserEditRequest) => {
            return ok(await userEdit(request, Database.get(), FileStorage.get()))
        }))
    }
}
