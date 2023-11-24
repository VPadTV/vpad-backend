import { Errors } from "@domain/helpers/index.ts"
import { DatabaseClient } from "@infra/gateways/database.ts"

export type AdminManageBanRequest = {
  id: string
} & (
    { banned: true, banTimeout?: string | null } |
    { banned: false })

export type AdminManageBanResponse = {
  id: string
  banned: boolean
  banTimeout?: string
}

export async function adminManageBan(req: AdminManageBanRequest, db: DatabaseClient): Promise<AdminManageBanResponse> {
  if (req.banned !== true && req.banned !== false) throw Errors.BAD_REQUEST()

  const user = await db.user.update({
    where: { id: req.id },
    data: {
      banned: req.banned,
      banTimeout: req.banned ? (req.banTimeout ?? null) : null
    }
  })
  return { id: user.id, banned: user.banned, banTimeout: user.banTimeout?.toISOString() ?? undefined }
}