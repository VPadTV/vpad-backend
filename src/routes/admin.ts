import { middleware, jsonResponse } from '@infra/adapters'
import { IRoute } from '@main/route'
import { Router } from 'express'
import { Database } from '@infra/gateways'
import { isAdmin } from '@infra/middlewares/isAdmin'
import { adminManageBan } from '@functions/admin/manageBan'
import { adminGetMany } from '@functions/admin/getMany'
import { adminManage } from '@functions/admin/manage'

export class AdminRoute implements IRoute {
    register(router: Router): void {
        router.use(middleware(isAdmin))

        router.get('/',
            jsonResponse(adminGetMany, Database.get()))

        router.put('/manage/admin/:id',
            jsonResponse(adminManage, Database.get()))

        router.put('/manage/ban/:id',
            jsonResponse(adminManageBan, Database.get()))
    }
}
