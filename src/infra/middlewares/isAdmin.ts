import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { tokenWrapper } from './wrappers/tokenWrapper'

export const isAdmin = async (data: MiddlewareData) =>
    tokenWrapper(data, async (user) => {
        if (!user.admin) throw Errors.FORBIDDEN()
    })