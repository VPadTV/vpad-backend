import { JWT } from '@plugins/jwt';
import { Errors } from '@plugins/errors';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';
import { OptionalTokenMiddlewareResponse } from './decodeOptionalToken.types';
import { MiddlewareData } from './middleware.types';

export const optionalToken = async (
	data: MiddlewareData,
): Promise<OptionalTokenMiddlewareResponse> => {
	const { authorization } = data;
	if (!authorization) return {};

	const bearerToken = authorization.replace('Bearer ', '');

	const token = JWT.decode(bearerToken);
	if (!token || !token.sub || !token.exp) throw Errors.INVALID_TOKEN();

	const now = Date.now();
	if (now > token.exp) throw Errors.EXPIRED_TOKEN();

	const id = token.sub.split('#')[0];

	const db = new PrismaUseCase();
	const user = await db.user.findFirst({ where: { id } });
	if (!user) throw Errors.UNAUTHORIZED();

	// if it expires in less than a week
	if (token.exp - now < 24 * 60 * 60 * 1000 * 7)
		return { user, token: JWT.newToken(user) };

	return { user };
};
