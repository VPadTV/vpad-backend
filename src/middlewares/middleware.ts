import { Response, Request, NextFunction } from 'express';
import { HttpError } from '@plugins/errors';
import { MiddlewareData } from './middleware.types';

export function middleware(fn: (request: MiddlewareData) => Promise<unknown>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await fn({
				authorization: req.headers.authorization as string,
				params: req.params,
			});
			req.middleware = {
				...data as object,
			};
			next();
		} catch (error) {
			console.error(`** Middleware **`);
			console.error(error);
			if (error instanceof HttpError)
				return res.status(error.status).send({ error: error.message });
			return res.status(500).send({ error: 'Internal Server Error' });
		}
	};
}
