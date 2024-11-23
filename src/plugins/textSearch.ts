import { Json } from "./http";

type PrismaWhere<T> = {
    OR: T[]
}

export function textSearch<T>(key: string | ((word: string) => Json), search: string | undefined): {} | PrismaWhere<T> {
    if (!search) return {}

    let where: PrismaWhere<any> = {
        OR: []
    }

    for (const word of search.split(' ')) {
        if (typeof key === 'string')
            where.OR.push({
                [key]: { contains: word }
            })
        else
            where.OR.push(key(word))
    }

    return where
}