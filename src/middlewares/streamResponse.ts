import { HttpError } from '@plugins/errors';
import { Response, Request } from 'express';

export function streamResponse<U extends any>(
	fn: (request: any) => Promise<U>,
) {
	return async (req: Request, res: Response) => {
		try {
			const { stream, ContentLength, ContentType } = await fn({
				...req.params,
				...req.query,
				...res.locals,
			});
			res.writeHead(200, {
				'Content-Length': ContentLength,
				'Content-Type': ContentType,
			});
			const streaming = stream.pipe(res);
			streaming.on('close', () => {
				res.end();
			});
		} catch (error) {
			console.error(`** Streaming **`);
			console.error(error);
			if (error instanceof HttpError)
				return res.status(error.status).send({ error: error.message });
			return res.status(500).send({ error: 'Internal Server Error' });
		}
	};
}
