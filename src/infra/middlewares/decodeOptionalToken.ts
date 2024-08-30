import { MiddlewareData } from '@infra/adapters'
import { openToken } from '@plugins/openToken'
import { User } from '@prisma/client'

export type OptionalTokenMiddlewareResponse = {
    user?: User,
    token?: string
}

export const optionalToken = async (data: MiddlewareData): Promise<OptionalTokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) return {}
    return openToken(authorization.replace('Bearer ', ''))

}