import { HttpError, HttpResponse } from '@domain/helpers'
import { Response, Request } from 'express'

export function expressRouterAdapter<T, U extends HttpResponse>(fn: (request: T) => Promise<U>) {
  return async (req: Request, res: Response) => {
    const body = Array.isArray(req.body) ? { data: req.body } : req.body

    try {
      const { statusCode, data } = await fn({
        ...body,
        ...req.params,
        ...req.query,
        ...res.locals,
      })
      return res.status(statusCode).json({ ...data, token: data.token ?? req.params?.token })
    } catch (error) {
      console.error(`<RouteError>: ${error?.message}`)
      if (error instanceof HttpError) {
        return res.status(error.code).json({ error: error.message })
      }
      return res.status(500).json({ error })
    }
  }
}
