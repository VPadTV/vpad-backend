import { DatabaseClient } from '@infra/gateways/database'
import { Req } from '@plugins/requestBody'
import { paginate, Paginate } from '@plugins/paginate'
import { SimpleUserMapper } from '@infra/mappers/user'
import { Prisma } from '@prisma/client'

export type JobGetManyReq = {
    page: number
    size: number
    search?: string
    sortBy: 'latest' | 'oldest'
}

export type JobGetManyRes = Paginate<{
    id: string,
    description: string,
    candidates: {
        id: string
        nickname: string,
        profilePhotoUrl: string | null
    }[],
    createdAt: Date,
    updatedAt: Date,
}>

export async function jobGetMany(req: Req<JobGetManyReq>, db: DatabaseClient): Promise<JobGetManyRes> {
    const page = +(req.page ?? 0)
    const size = +(req.size ?? 0)

    const where: Prisma.JobWhereInput = {
        OR: [
            { description: { search: req.search } },
            { owner: { nickname: { search: req.search } } },
        ]
    }

    const [jobs, total] = await db.$transaction([
        db.job.findMany({
            skip: page * size,
            take: size,
            where,
            select: {
                id: true,
                description: true,
                candidates: {
                    select: {
                        candidate: {
                            select: SimpleUserMapper.selector
                        },
                    }
                },
                createdAt: true,
                updatedAt: true,
            }
        }),
        db.job.count({
            where,
        }),
    ])

    return paginate(total, page, size, jobs.map(job => ({
        ...job,
        candidates: job.candidates.map(candidate => candidate.candidate),
    })))
}
