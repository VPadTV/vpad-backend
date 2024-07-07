import { makeRoute } from "@docs/helpers";
import { exDate } from "@docs/schemas/dateExample";
import { exId } from "@docs/schemas/id";
import { simpleUser } from "@docs/schemas/simpleUser";

export const commNoId = {
    post: makeRoute({
        tag: 'Commission',
        summary: 'Creates a new commission',
        body: {
            title: 'funny commission',
            details: 'i want this and this and that',
            creatorId: exId,
            price: 1200
        },
        bodyRequired: ['title', 'details', 'creatorId', 'price']
    }),
    get: makeRoute({
        tag: 'Commission',
        summary: 'Gets commissions, either mine or others',
        query: {
            take: 'i-commissioned , got-commissioned',
            sortBy: 'latest , oldest',
            page: 1,
            size: 10,
        },
        success: {
            total: 100,
            to: 30,
            from: 0,
            currentPage: 1,
            lastPage: 4,
            data: {
                id: exId,
                title: 'funnny commission',
                details: 'i want this and this and that',
                price: 1200,
                user: simpleUser,
                creator: simpleUser,
                createdAt: exDate,
                updatedAt: exDate,
            }
        }
    }),
}