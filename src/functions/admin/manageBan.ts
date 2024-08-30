import { Errors } from '@plugins/http'
import { DatabaseClient } from '@infra/gateways/database'
import { UserReq } from '@plugins/requestBody'

export type AdminManageBanRequest = {
    id: string,
    banned: boolean
    banTimeout?: string | null
}

export type AdminManageBanResponse = {
    id: string
    banned: boolean
    banTimeout?: string
}

export async function adminManageBan(req: UserReq<AdminManageBanRequest>, db: DatabaseClient): Promise<AdminManageBanResponse> {
    if (!req.id) throw Errors.MISSING_ID()
    if (req.banned !== true && req.banned !== false) throw Errors.BAD_REQUEST()
    if (req.banned === false && req.banTimeout) throw Errors.BAD_REQUEST()

    const user = await db.user.update({
        where: { id: req.id },
        data: {
            banned: req.banned,
            banTimeout: req.banned ? (req.banTimeout ?? null) : null
        }
    })
    return { id: user.id, banned: user.banned, banTimeout: user.banTimeout?.toISOString() ?? undefined }
}