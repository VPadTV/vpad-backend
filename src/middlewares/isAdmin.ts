import { Errors } from '@plugins/errors'
import { tokenWrapper } from './tokenWrapper'
import { MiddlewareData } from './middleware.types'

export const isAdmin = async (data: MiddlewareData) =>
    tokenWrapper(data, async (user) => {
        if (!user.admin) throw Errors.FORBIDDEN()
    })