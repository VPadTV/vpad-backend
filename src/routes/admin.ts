import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.ts"
import { IRoute } from "@main/route.ts"
import { Router } from "express"
import { ok } from "@domain/helpers/index.ts"
import { Database } from "@infra/gateways/index.ts"
import { AdminManageBanRequest, adminManageBan } from "@domain/functions/admin/manageBan.ts"
import { isAdmin } from "@infra/middlewares/isAdmin.ts"
import { AdminGetManyRequest, adminGetMany } from "@domain/functions/admin/getMany.ts"
import { AdminManageRequest, adminManage } from "@domain/functions/admin/manage.ts"

export class AdminRoute implements IRoute {
  register(router: Router): void {
    router.use(expressMiddlewareAdapter(isAdmin))

    router.get('/',
      expressRouterAdapter(async (request: AdminGetManyRequest) => {
        return ok(await adminGetMany(request, Database.get()))
      }))

    router.post('/manage/admin/:id',
      expressRouterAdapter(async (request: AdminManageRequest) => {
        return ok(await adminManage(request, Database.get()))
      }))

    router.post('/manage/ban/:id',
      expressRouterAdapter(async (request: AdminManageBanRequest) => {
        return ok(await adminManageBan(request, Database.get()))
      }))
  }
}
