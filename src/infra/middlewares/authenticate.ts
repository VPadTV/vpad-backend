import { ErrorMessage } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway } from '@infra/gateways'
import { Database } from '@infra/gateways/database'

export type AuthenticateMiddlewareResponse = {
    id: number
    token?: string
}

export const authenticate = async ({
    authorization
}: MiddlewareData): Promise<AuthenticateMiddlewareResponse> => {
    if (!authorization) throw new Error(ErrorMessage.UNAUTHORIZED.key)
    const bearerToken = authorization.replace('Bearer ', '')

    const token = JwtGateway.decode(bearerToken)
    if (!token || !token.sub)
        throw new Error(ErrorMessage.INVALID_TOKEN.key)

    const id = +token.sub

    const db = Database.get()
    const user = await db.user.findFirst({ where: { id: id } })
    if (!user)
        throw new Error(ErrorMessage.UNAUTHORIZED.key)
    
    // if it expires in less than a day
    if (token.exp - Date.now() < 24*60*60*1000) {
        // return new token or something
        return {
            id,
            token: JwtGateway.newToken(id, user.name)
        }
    }

    return { id }
}