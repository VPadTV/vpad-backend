import { middleware, jsonResponse } from '@infra/adapters'
import { IRoute } from '@main/route'
import { Router } from 'express'
import { ok } from '@plugins/http'
import { Database } from '@infra/gateways'
import { isAdmin } from '@infra/middlewares/isAdmin'
import { adminManageBan } from '@functions/admin/manageBan'
import { adminGetMany } from '@functions/admin/getMany'
import { adminManage } from '@functions/admin/manage'

export class AdminRoute implements IRoute {
    register(router: Router): void {
        router.use(middleware(isAdmin))

        router.get('/',
            jsonResponse(async (request: any) => {
                return ok(await adminGetMany(request, Database.get()))
            }))

        router.put('/manage/admin/:id',
            jsonResponse(async (request: any) => {
                return ok(await adminManage(request, Database.get()))
            }))

        router.put('/manage/ban/:id',
            jsonResponse(async (request: any) => {
                return ok(await adminManageBan(request, Database.get()))
            }))
    }
}
