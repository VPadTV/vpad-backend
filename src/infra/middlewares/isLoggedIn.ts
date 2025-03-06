import { MiddlewareData } from '@infra/adapters/middleware'
import { requiredToken } from './wrappers/requiredToken'

export const isLoggedIn = async (data: MiddlewareData) =>
    requiredToken(data, async (_) => { })