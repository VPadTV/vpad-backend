import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway, Database } from '@infra/gateways'

export type PrivateInfoMiddlewareResponse = {
    id: string
    token?: string
}

export const privateInfo = async ({
    authorization,
    params
}: MiddlewareData): Promise<PrivateInfoMiddlewareResponse> => {
    if (!authorization) throw Errors.MISSING_TOKEN()
    const bearerToken = authorization.replace('Bearer ', '')

    const token = JwtGateway.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()

    const id = token.sub.split('#')[0]

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: id } })

    if (!user) throw Errors.UNAUTHORIZED()

    const queryId = params?.userId ?? params?.id
    if (queryId && user.id !== queryId) throw Errors.FORBIDDEN()
    
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