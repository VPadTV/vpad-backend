import { Errors } from '@plugins/http'
import { MiddlewareData } from '@infra/adapters'
import { User } from '@prisma/client'
import { openToken } from '@plugins/openToken'

export type TokenMiddlewareResponse = {
    user: User,
    token?: string
}

export const tokenWrapper = async (data: MiddlewareData, func: (user: User) => Promise<void>): Promise<TokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) throw Errors.MISSING_TOKEN()

    const opened = await openToken(authorization.replace('Bearer ', ''))

    await func(opened.user)

    return opened
}