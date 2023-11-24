import { Errors } from '@domain/helpers/index.ts'
import { MiddlewareData } from '@infra/adapters/index.ts'
import { tokenMiddleware } from './wrappers/hasToken.ts'

export const isAdmin = async (data: MiddlewareData) =>
  tokenMiddleware(data, async (user) => {
    if (!user.admin) throw Errors.FORBIDDEN()
  })