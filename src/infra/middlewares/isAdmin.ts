import { Errors } from '@domain/helpers/index.js'
import { MiddlewareData } from '@infra/adapters/index.js'
import { tokenMiddleware } from './wrappers/hasToken.js'

export const isAdmin = async (data: MiddlewareData) =>
  tokenMiddleware(data, async (user) => {
    if (!user.admin) throw Errors.FORBIDDEN()
  })