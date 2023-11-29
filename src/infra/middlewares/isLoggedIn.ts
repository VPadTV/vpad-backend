import { MiddlewareData } from '@infra/adapters/middleware'
import { tokenWrapper } from './wrappers/tokenWrapper'

export const isLoggedIn = async (data: MiddlewareData) =>
    tokenWrapper(data, async (_) => { })