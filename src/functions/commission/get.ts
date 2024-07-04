import { DatabaseClient } from "@infra/gateways"
import { SimpleUser } from "@infra/mappers/user"
import { Errors } from "@plugins/http"
import { paginate } from "@plugins/paginate"
import { User } from "@prisma/client"

export type CommissionGetRequest = {
    user: User
    take: 'i-commissioned' | 'got-commissioned'

    sortBy: 'latest' | 'oldest'

    page: number
    size: number
}

export type CommissionGetResponse = {}

export type CommSort = {
    createdAt: 'asc' | 'desc'
}

type CommWhere = { userId: string } | { creatorId: string }

export async function commGet(req: CommissionGetRequest, db: DatabaseClient): Promise<CommissionGetResponse> {
    let orderBy: CommSort
    switch (req.sortBy) {
        case 'oldest':
            orderBy = { createdAt: 'asc' }
            break
        case 'latest':
            orderBy = { createdAt: 'desc' }
            break
        default:
            throw Errors.INVALID_SORT()
    }
    const offset = (+req.page - 1) * +req.size

    let where: CommWhere

    if (req.take === 'i-commissioned') {
        where = { userId: req.user.id }
    } else if (req.take === 'got-commissioned') {
        where = { creatorId: req.user.id }
    } else {
        throw Errors.INVALID_TAKE()
    }

    const [comms, total] = await db.$transaction([
        db.commission.findMany({
            skip: offset,
            take: req.size,
            where,
            orderBy,
            select: {
                id: true,
                title: true,
                details: true,
                price: true,
                user: { select: SimpleUser.selector },
                creator: { select: SimpleUser.selector },
                createdAt: true,
                updatedAt: true,
            }
        }),
        db.commission.count({ where: { userId: req.user.id }, orderBy }),
    ])

    return paginate(total, req.page, offset, req.size, comms)
}