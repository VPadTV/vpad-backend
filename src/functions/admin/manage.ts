import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { User } from '@prisma/client'
import { UserReq } from '@plugins/requestBody'

export type AdminManageRequest = {
    user: User
    id: string
    admin: boolean
}

export type AdminManageResponse = {
    id: string
    admin: boolean
}

export async function adminManage(req: UserReq<AdminManageRequest>, db: DatabaseClient): Promise<AdminManageResponse> {
    if (!req.id) throw Errors.MISSING_ID()
    if (!req.admin) throw Errors.MISSING_ADMIN()
    if (req.id === req.user.id)
        throw Errors.FORBIDDEN()

    if (req.admin !== true && req.admin !== false) throw Errors.BAD_REQUEST()

    const user = await db.user.update({
        where: { id: req.id },
        data: {
            admin: req.admin
        }
    })

    return { id: user.id, admin: user.admin }
}