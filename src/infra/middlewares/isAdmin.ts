import { Errors } from '@plugins/http'
import { MiddlewareData } from '@infra/adapters'
import { requiredToken } from './wrappers/requiredToken'

export const isAdmin = async (data: MiddlewareData) =>
    requiredToken(data, async (user) => {
        if (!user.admin) throw Errors.FORBIDDEN()
    })