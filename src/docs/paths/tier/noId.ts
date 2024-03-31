import { makeRoute } from 'src/old/docs/helpers';

export const tierNoId = {
    post: makeRoute({
        tag: 'Subscription Tier',
        summary: 'Creates subscription tier, must be logged in',
        bodyRequired: ['name', 'price'],
        body: {
            name: 'some tier name',
            price: 1.99
        },
        400: 'Missing name, Missing price',
    }),
}