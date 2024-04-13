import { makeRoute } from '@docs/helpers';
import { exId } from '@docs/schemas/id';

export const tierId = {
	put: makeRoute({
		tag: 'Subscription Tier',
		summary: 'Updates subscription tier from id, must be logged in',
		bodyRequired: ['name'],
		path: { id: exId },
		body: {
			name: 'some tier name',
		},
		400: 'Missing ID, Missing name',
	}),
	delete: makeRoute({
		tag: 'Subscription Tier',
		summary: 'Deletes subscription tier from id, must be logged in',
		path: { id: exId },
		400: 'Missing ID',
	}),
};
