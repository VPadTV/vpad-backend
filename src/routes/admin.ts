import { expressMiddlewareAdapter, expressRouterAdapter } from "@infra/adapters/index.js"
import { IRoute } from "@main/route.js"
import { Router } from "express"
import { ok } from "@domain/helpers/index.js"
import { Database } from "@infra/gateways/index.js"
import { AdminManageBanRequest, adminManageBan } from "@domain/functions/admin/manageBan.js"
import { isAdmin } from "@infra/middlewares/isAdmin.js"
import { AdminGetManyRequest, adminGetMany } from "@domain/functions/admin/getMany.js"
import { AdminManageRequest, adminManage } from "@domain/functions/admin/manage.js"

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
