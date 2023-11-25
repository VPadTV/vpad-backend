import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { tokenMiddleware } from './wrappers/hasToken'

export const isAdmin = async (data: MiddlewareData) =>
    tokenMiddleware(data, async (user) => {
        if (!user.admin) throw Errors.FORBIDDEN()
    })