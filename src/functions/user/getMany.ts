import { Errors } from '@plugins/http'
import { SimpleUser } from '@infra/mappers/user'
import { DatabaseClient } from '@infra/gateways/database'
import { HttpReq } from '@plugins/requestBody'
import { Paginate, paginate } from '@plugins/paginate'
import { textSearch } from '@plugins/textSearch'
import { Prisma } from '@prisma/client'

export type UserGetManyRequest = {
    search: string
    page: number,
    size: number,
    sortBy: 'nickname' | 'createdAt'
    sortDirection: 'oldest' | 'latest'
}

export type UserGetManyResponse = SimpleUser

export async function userGetMany(req: HttpReq<UserGetManyRequest>, db: DatabaseClient): Promise<Paginate<UserGetManyResponse>> {
    const page = req.page ?? 1
    const size = req.size ?? 100
    const offset = (page - 1) * size

    if (req.sortBy !== 'nickname' && req.sortBy !== 'createdAt')
        throw Errors.BAD_REQUEST()

    let sort = 'asc'
    if (req.sortDirection === 'latest')
        sort = 'desc'

    const where: Prisma.UserWhereInput = textSearch('nickname', req.search)

    const [users, total] = await db.$transaction([
        db.user.findMany({
            skip: offset,
            take: size,
            where,
            select: {
                ...SimpleUser.selector,
            },
            orderBy: {
                [req.sortBy]: sort
            }
        }),
        db.user.count({
            where,
        })
    ])

    return paginate(total, page, offset, size, users)
}