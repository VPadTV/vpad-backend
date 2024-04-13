import { makeRoute } from "@docs/helpers";
import { exId } from "@docs/schemas/id";


export const payNoId = {
	post: makeRoute({
		tag: 'Pay',
		summary: 'Starts a payment session',
		success: {
			id: exId,
		},
	}),
};
