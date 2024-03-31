
import { User } from '@prisma/client'
import { Errors } from '@plugins/errors';
import { JWT } from '@plugins/jwt';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';
import { MiddlewareData } from './middleware.types';
import { TokenMiddlewareResponse } from './tokenWrapper.types';



export const tokenWrapper = async (data: MiddlewareData, func: (user: User) => Promise<void>): Promise<TokenMiddlewareResponse> => {
    const { authorization } = data;
    if (!authorization) throw Errors.MISSING_TOKEN()

    const bearerToken = authorization.replace('Bearer ', '')
    const token = JWT.decode(bearerToken)
    if (!token || !token.sub || !token.exp)
        throw Errors.INVALID_TOKEN()

    const now = Date.now()
    if (now > token.exp) throw Errors.EXPIRED_TOKEN()

    const id = token.sub.split('#')[0]

    const db = new PrismaUseCase()
    const user = await db.user.findFirst({ where: { id } })
    if (!user) throw Errors.UNAUTHORIZED()

    await func(user)

    // if it expires in less than a day
    if (token.exp - now < 24 * 60 * 60 * 1000)
        return { user, token: JWT.newToken(user) }

    return { user }
}