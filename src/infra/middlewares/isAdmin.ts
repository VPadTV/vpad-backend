import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway, Database } from '@infra/gateways'

export type IsAdminMiddlewareResponse = {
    id: string
    token?: string
}

export const isAdmin = async ({
    authorization
}: MiddlewareData): Promise<IsAdminMiddlewareResponse> => {
    if (!authorization) throw Errors.MISSING_TOKEN()
    const bearerToken = authorization.replace('Bearer ', '')

    const token = JwtGateway.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()

    const id = token.sub.split('#')[0]

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: id } })

    if (!user) throw Errors.UNAUTHORIZED()
    
    if (!user.admin) throw Errors.FORBIDDEN()
    
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