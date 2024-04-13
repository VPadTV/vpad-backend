import { makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";


export const adminId = {
	put: makeRoute({
		tag: 'Admin',
		summary: 'Manages admins',
		security: false,
		path: { id: exId },
		bodyRequired: ['admin'],
		body: {
			admin: true,
		},
		success: {
			id: exId,
			admin: true,
		},
		400: '`admin` must be `true` or `false`',
	}),
};
