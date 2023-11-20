import { ErrorMessage } from '@domain/helpers'
import { Response, Request, NextFunction } from 'express'

export type MiddlewareData = {
  authorization: string;
  params: {[key: string]: string};
}

export function expressMiddlewareAdapter(fn: (request: MiddlewareData) => Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn({
        authorization: req.headers.authorization,
        params: req.params
      })
      next()
    } catch (error) {
      if (ErrorMessage[error?.message]) {
          const errorData = ErrorMessage[error?.message]
          return res.status(errorData.statusCode).json({ error: errorData.key })
      }
      return res.status(500).json({ error })
    }
  }
}
