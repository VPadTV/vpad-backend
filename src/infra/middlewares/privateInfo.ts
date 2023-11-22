import { Errors } from '@domain/helpers'
import { MiddlewareData } from '@infra/adapters'
import { tokenMiddleware } from './wrappers/hasToken'

export const privateInfo = async (data: MiddlewareData) =>
tokenMiddleware(data, async (user) => {
    const { params } = data;
    const queryId = params?.userId ?? params?.id
    if (queryId && user.id !== queryId) throw Errors.FORBIDDEN()
    return { id: user.id }
})