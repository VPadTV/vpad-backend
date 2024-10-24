import { Errors } from '@plugins/http'
import { SimpleUserMapper } from '@infra/mappers/user'
import { boolify } from '@plugins/boolify'
import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'
import { Paginate, paginate } from '@plugins/paginate'

export type UserGetManyRequest = {
    page?: number,
    size?: number,
    usernameSearch?: string
    nicknameSearch?: string
    banned?: boolean
}

export type UserGetManyResponse = Paginate<SimpleUserMapper>

export async function userGetMany(req: Req<UserGetManyRequest>, db: DatabaseClient): Promise<UserGetManyResponse> {
    let page = +(req.page ?? 0)
    let size = +(req.size ?? 100)

    req.banned = boolify(req.banned)
    const [users, total] = await db.$transaction([
        db.user.findMany({
            skip: page * size,
            take: size,
            where: {
                username: req.usernameSearch ? {
                    search: req.usernameSearch,
                } : undefined,
                nickname: req.nicknameSearch ? {
                    search: req.nicknameSearch,
                } : undefined,
                banned: req.banned,
            },
            select: {
                ...SimpleUserMapper.selector,
            },
            orderBy: {
                createdAt: 'desc'
            }
        }),
        db.user.count({
            where: {
                username: req.usernameSearch ? {
                    search: req.usernameSearch,
                } : undefined,
                nickname: req.nicknameSearch ? {
                    search: req.nicknameSearch,
                } : undefined,
                banned: req.banned,
            },
        })
    ])

    if (!users || users.length === 0) throw Errors.NOT_FOUND()

    return paginate(total, page, size, users)
}