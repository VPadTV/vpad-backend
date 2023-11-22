import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway, Database } from '@infra/gateways'
import { User } from '@prisma/client'

export type TokenMiddlewareResponse = {[key: string]: any}

export const tokenMiddleware = async (data: MiddlewareData, func: (user: User) => Promise<TokenMiddlewareResponse>) => {
    const { authorization } = data;
    if (!authorization) throw Errors.MISSING_TOKEN()
    const bearerToken = authorization.replace('Bearer ', '')

    const token = JwtGateway.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()
    
    const now = Date.now()
    if (now > token.exp) throw Errors.EXPIRED_TOKEN()

    const id = token.sub.split('#')[0]

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: id } })
    if (!user) throw Errors.UNAUTHORIZED()

    const middlewareResponse = func(user)

    // if it expires in less than a day
    if (token.exp - now < 24*60*60*1000)
        return { ...middlewareResponse, token: JwtGateway.newToken(user) }

    return func(user);
}