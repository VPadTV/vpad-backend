import { MiddlewareData } from './middleware.types';
import { tokenWrapper } from './tokenWrapper';

export const isLoggedIn = async (data: MiddlewareData) =>
	tokenWrapper(data, async (_) => {});
