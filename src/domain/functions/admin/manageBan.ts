import { DatabaseClient } from "@infra/gateways/database"

export type AdminManageBanRequest = {
    userId: string
} & ({
    banned: true
    banTimeout?: string | null
} | {
    banned: false
})

export type AdminManageBanResponse = {
    id: string
    banned: boolean
    banTimeout?: Date | null
}

export async function manageBan(req: AdminManageBanRequest, db: DatabaseClient): Promise<AdminManageBanResponse> {
    const user = await db.user.update({
        where: { id: req.userId },
        data: {
            banned: req.banned,
            banTimeout: req.banned ? (req.banTimeout ?? null) : null 
        }
    })
    return { id: user.id, banned: user.banned, banTimeout: user.banTimeout ?? undefined }
}