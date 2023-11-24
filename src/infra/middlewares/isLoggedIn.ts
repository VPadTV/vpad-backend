import { MiddlewareData } from '@infra/adapters/expressMiddleware.ts'
import { tokenMiddleware } from './wrappers/hasToken.ts'

export const isLoggedIn = async (data: MiddlewareData) =>
  tokenMiddleware(data, async (_user) => { })