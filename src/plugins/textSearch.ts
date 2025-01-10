import { Json } from "./http";

export function textSearch<T>(key: string | ((word: string) => Json | T), search: string | undefined): T[] {
    if (!search) return []

    let or: any[] = []

    for (const word of search.split(' ')) {
        if (typeof key === 'string')
            or.push({
                [key]: { contains: word }
            })
        else
            or.push(key(word))
    }

    return or
}