import { ErrorMessage } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { JwtGateway } from '@infra/gateways'
import { Database } from '@infra/gateways/prisma'

export type AuthenticateMiddlewareResponse = {
    id: number
}

export const authenticate = async ({
    authorization,
}: MiddlewareData): Promise<AuthenticateMiddlewareResponse> => {
    const jwt = new JwtGateway()
    const token = jwt.decode(authorization.replace('Bearer ', ''))

    if (!token || !token.sub)
        throw new Error(ErrorMessage.INVALID_TOKEN.key)

    const id = +token.sub

    const db = Database.get()
    db.crewmate.findFirst({
        where: { id }
    })
    // if it expires in less than a day
    if (token.exp - Date.now() < 24*60*60*1000) {
        // return new token or something
    }

    return { id }
}