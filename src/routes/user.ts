import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { authenticate } from "@infra/middlewares/authenticate";
import { UserGetByIdRequest, userFindById } from "@domain/functions/user/findById";
import { UserLoginRequest, userLogin } from "@domain/functions/user/login";
import { UserRegisterRequest, userRegister } from "@domain/functions/user/register";
import { UserEditRequest, userEdit } from "@domain/functions/user/edit";
import { Database, FileStorage } from "@infra/gateways";

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
        
        router.get('/get/:id',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: UserGetByIdRequest) => {
            return ok(await userFindById(request, Database.get()))
        }))

        router.put('/edit/:id',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: UserEditRequest) => {
            return ok(await userEdit(request, Database.get(), FileStorage.get()))
        }))
    }
}
