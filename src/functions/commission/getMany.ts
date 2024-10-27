import { DatabaseClient } from "@infra/gateways"
import { SimpleUserMapper } from "@infra/mappers/user"
import { Errors } from "@plugins/http"
import { paginate } from "@plugins/paginate"
import { UserReq } from "@plugins/requestBody";
import { Prisma } from "@prisma/client";

export type CommissionGetRequest = {
    take: 'i-commissioned' | 'they-commissioned'

    sortBy: 'latest' | 'oldest'

    page: number
    size: number
}

export type CommissionGetResponse = {}

export type CommSort = {
    createdAt: 'asc' | 'desc'
}

export async function commGetMany(req: UserReq<CommissionGetRequest>, db: DatabaseClient): Promise<CommissionGetResponse> {
    const page = +(req.page ?? 0)
    const size = +(req.size ?? 100)
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

    let where: Prisma.CommissionWhereInput

    if (req.take === 'i-commissioned') {
        where = { userId: req.user.id }
    } else if (req.take === 'they-commissioned') {
        where = { creatorId: req.user.id }
    } else {
        throw Errors.INVALID_TAKE()
    }

    const [comms, total] = await db.$transaction([
        db.commission.findMany({
            skip: page * size,
            take: size,
            where,
            orderBy,
            select: {
                id: true,
                title: true,
                details: true,
                price: true,
                user: { select: SimpleUserMapper.selector },
                creator: { select: SimpleUserMapper.selector },
                createdAt: true,
                updatedAt: true,
            }
        }),
        db.commission.count({ where: { userId: req.user.id } }),
    ])

    return paginate(total, page, size, comms)
}