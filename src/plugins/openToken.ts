import { JWT, Database } from "@infra/gateways"
import { User } from "@prisma/client"
import { Errors } from "./http"

export type OpenTokenResponse = {
    user: User,
    token?: string
}

export async function openToken(bearerToken: string): Promise<OpenTokenResponse> {
    const { id, exp } = JWT.decode(bearerToken)

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id } })
    if (!user) throw Errors.UNAUTHORIZED()

    // if it expires in less than a week
    if (exp - Date.now() < 24 * 60 * 60 * 1000 * 7)
        return { user, token: JWT.newToken(user) }

    return { user }
}