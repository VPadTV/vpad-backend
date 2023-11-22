type Paginate<T> = {
    total: number
    page: number
    size: number
    data: T[]
}