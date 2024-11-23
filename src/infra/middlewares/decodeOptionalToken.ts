import { Errors } from '@plugins/http'
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

    // if it expires in less than a week
    if (token.exp - now < 24 * 60 * 60 * 1000 * 7)
        return { user, token: JWT.newToken(user, data.headers) }

    return { user }
}