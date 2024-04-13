import { User } from '@prisma/client';

export type OptionalTokenMiddlewareResponse = {
	user?: User;
	token?: string;
};
