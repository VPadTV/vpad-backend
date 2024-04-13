import { makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";


export const subId = {
	put: makeRoute({
		tag: 'Subscription',
		summary: 'Updates subscription from id, must be logged in',
		bodyRequired: ['tierId'],
		path: { id: exId },
		body: {
			tierId: exId,
		},
		400: 'Missing ID',
	}),
	delete: makeRoute({
		tag: 'Subscription',
		summary: 'Deletes a subscription from id, must be logged in',
		path: { id: exId },
		400: 'Missing ID',
	}),
};
