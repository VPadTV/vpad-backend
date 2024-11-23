import { Errors } from '@plugins/http'
import { MiddlewareData } from '@infra/adapters'
import { JWT, Database } from '@infra/gateways'
import { User } from '@prisma/client'

export type TokenMiddlewareResponse = {
    user: User,
    token?: string
}

export const requiredToken = async (data: MiddlewareData, func: (user: User) => Promise<void>): Promise<TokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) throw Errors.MISSING_TOKEN()

    const bearerToken = authorization.replace('Bearer ', '')
    const token = JWT.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()

    const now = Date.now()
    if (now > token.exp) throw Errors.EXPIRED_TOKEN()

    const [id, agent] = token.sub.split('#')

    console.log(agent)
    console.log(data.headers['user-agent'])

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id } })
    if (!user) throw Errors.UNAUTHORIZED()

    await func(user)

    // if it expires in less than a week
    if (token.exp - now < 24 * 60 * 60 * 1000 * 7)
        return { user, token: JWT.newToken(user, data.headers) }

    return { user }
}