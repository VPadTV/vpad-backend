import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { authenticate } from "@infra/middlewares/authenticate";
import { UserGetByIdRequest, userFindById } from "@domain/functions/user/getById";
import { UserLoginRequest, userLogin } from "@domain/functions/user/login";
import { UserRegisterRequest, userRegister } from "@domain/functions/user/register";
import { UserEditRequest, userEdit } from "@domain/functions/user/edit";

export class UserRoute implements IRoute {
    prefix = '/user'
    register(router: Router): void {
        router.post('/register',
        expressRouterAdapter(async (request: UserRegisterRequest) => {
            return ok(await userRegister(request))
        }))

        router.post('/login',
        expressRouterAdapter(async (request: UserLoginRequest) => {
            return ok(await userLogin(request))
        }))
        
        router.get('/get/:id',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: UserGetByIdRequest) => {
            return ok(await userFindById(request))
        }))

        router.put('/edit/:id',
        expressMiddlewareAdapter(authenticate),
        expressRouterAdapter(async (request: UserEditRequest) => {
            return ok(await userEdit(request))
        }))
    }
}
