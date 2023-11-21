import { HttpError } from '@domain/helpers'
import { Response, Request, NextFunction } from 'express'

export type MiddlewareData = {
  authorization: string;
  params: {[key: string]: string};
}

export function expressMiddlewareAdapter(fn: (request: MiddlewareData) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fn({
        authorization: req.headers.authorization,
        params: req.params
      })
      req.params = {
        ...req.params,
        ...data
      }
      next()
    } catch (error) {
      console.error(`<MiddlewareError>: ${error?.message}`)
      if (error instanceof HttpError)
          return res.status(error.code).json({ error: error.message })
      return res.status(500).json({ error: error.message })
    }
  }
}
