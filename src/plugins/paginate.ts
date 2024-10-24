export type Paginate<T> = {
    currentPage: number
    lastPage: number
    data: T[]
}

export function paginate<T>(total: number, page: number, size: number, data: T[]): Paginate<T> {
    return {
        currentPage: page,
        lastPage: Math.ceil(total / size),
        data
    }
}