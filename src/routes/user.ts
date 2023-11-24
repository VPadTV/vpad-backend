import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.ts";
import { IRoute } from "@main/route.ts";
import { Router } from "express";
import { ok } from "@domain/helpers/index.ts";
import { isLoggedIn } from "@infra/middlewares/isLoggedIn.ts";
import { UserGetRequest, userGet } from "@domain/functions/user/get.ts";
import { UserLoginRequest, userLogin } from "@domain/functions/user/login.ts";
import { UserRegisterRequest, userRegister } from "@domain/functions/user/register.ts";
import { UserEditRequest, userEdit } from "@domain/functions/user/edit.ts";
import { Database, FileStorage } from "@infra/gateways/index.ts";

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
      expressRouterAdapter(async (request: UserGetRequest) => {
        return ok(await userGet(request, Database.get()))
      }))

    router.put('/:id',
      expressMiddlewareAdapter(isLoggedIn),
      expressRouterAdapter(async (request: UserEditRequest) => {
        return ok(await userEdit(request, Database.get(), FileStorage.get()))
      }))
  }
}
