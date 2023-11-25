import { middleware, jsonResponse } from "@infra/adapters"
import { IRoute } from "@main/route"
import { Router } from "express"
import { ok } from "@domain/helpers"
import { Database } from "@infra/gateways"
import { AdminManageBanRequest, adminManageBan } from "@domain/functions/admin/manageBan"
import { isAdmin } from "@infra/middlewares/isAdmin"
import { AdminGetManyRequest, adminGetMany } from "@domain/functions/admin/getMany"
import { AdminManageRequest, adminManage } from "@domain/functions/admin/manage"

export class AdminRoute implements IRoute {
    register(router: Router): void {
        router.use(middleware(isAdmin))

        router.get('/',
            jsonResponse(async (request: AdminGetManyRequest) => {
                return ok(await adminGetMany(request, Database.get()))
            }))

        router.post('/manage/admin/:id',
            jsonResponse(async (request: AdminManageRequest) => {
                return ok(await adminManage(request, Database.get()))
            }))

        router.post('/manage/ban/:id',
            jsonResponse(async (request: AdminManageBanRequest) => {
                return ok(await adminManageBan(request, Database.get()))
            }))
    }
}
