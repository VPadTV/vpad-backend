import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway } from '@infra/gateways'
import { Database } from '@infra/gateways/database'

export type AuthenticateMiddlewareResponse = {
    id: string
    token?: string
}

export const authenticate = async ({
    authorization
}: MiddlewareData): Promise<AuthenticateMiddlewareResponse> => {
    if (!authorization) throw Errors.MISSING_TOKEN()
    const bearerToken = authorization.replace('Bearer ', '')

    const token = JwtGateway.decode(bearerToken)
    if (!token || !token.sub)
        throw Errors.INVALID_TOKEN()

    const id = token.sub.split('#')[0]

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: id } })

    if (!user) throw Errors.UNAUTHORIZED()
    
    const now = Date.now()
    if (now > token.exp) {
        // if its expired
        throw Errors.EXPIRED_TOKEN()
    }
    else if (token.exp - now < 24*60*60*1000) {
        // if it expires in less than a day
        return {
            id,
            token: JwtGateway.newToken(user)
        }
    }

    return { id }
}