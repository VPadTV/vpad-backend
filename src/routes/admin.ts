import { middleware, jsonResponse } from '@infra/adapters'
import { IRoute } from '@main/route'
import { Router } from 'express'
import { ok } from '@helpers/http'
import { Database } from '@infra/gateways'
import { AdminManageBanRequest, adminManageBan } from '@functions/admin/manageBan'
import { isAdmin } from '@infra/middlewares/isAdmin'
import { AdminGetManyRequest, adminGetMany } from '@functions/admin/getMany'
import { AdminManageRequest, adminManage } from '@functions/admin/manage'

export class AdminRoute implements IRoute {
    register(router: Router): void {
        router.use(middleware(isAdmin))

        router.get('/',
            jsonResponse(async (request: AdminGetManyRequest) => {
                return ok(await adminGetMany(request, Database.get()))
            }))

        router.put('/manage/admin/:id',
            jsonResponse(async (request: AdminManageRequest) => {
                return ok(await adminManage(request, Database.get()))
            }))

        router.put('/manage/ban/:id',
            jsonResponse(async (request: AdminManageBanRequest) => {
                return ok(await adminManageBan(request, Database.get()))
            }))
    }
}
