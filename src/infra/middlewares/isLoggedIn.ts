import { MiddlewareData } from '@infra/adapters/expressMiddleware.js'
import { tokenMiddleware } from './wrappers/hasToken.js'

export const isLoggedIn = async (data: MiddlewareData) =>
  tokenMiddleware(data, async (_user) => { })