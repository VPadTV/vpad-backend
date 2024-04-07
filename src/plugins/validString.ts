export const validString = (s: unknown): string | undefined => {
	if (typeof s === 'string' && s.length > 0) return s;
	return undefined;
};
