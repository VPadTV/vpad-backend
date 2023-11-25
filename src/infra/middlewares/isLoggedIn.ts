import { MiddlewareData } from '@infra/adapters/expressMiddleware'
import { tokenMiddleware } from './wrappers/hasToken'

export const isLoggedIn = async (data: MiddlewareData) =>
    tokenMiddleware(data, async (_user) => { })