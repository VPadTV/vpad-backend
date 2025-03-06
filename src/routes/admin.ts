import { middleware, route } from '@infra/adapters'
import { IRoute } from '@main/route'
import { Router } from 'express'
import { Database } from '@infra/gateways'
import { isAdmin } from '@infra/middlewares/isAdmin'
import { adminManageBan } from '@functions/admin/manageBan'
import { adminGetMany } from '@functions/admin/getMany'
import { adminManage } from '@functions/admin/manage'

export class AdminRoute implements IRoute {
    prefix = '/admin'

    register(router: Router): void {
        router.use(middleware(isAdmin))

        router.get('/',
            route(adminGetMany, Database.get()))

        router.put('/manage/admin/:id',
            route(adminManage, Database.get()))

        router.put('/manage/ban/:id',
            route(adminManageBan, Database.get()))
    }
}
