export type Paginate<T> = {
  total: number
  to: number
  from: number
  currentPage: number
  lastPage: number
  data: T[]
}

export function paginate<T>(total: number, page: number, offset: number, size: number, data: T[]): Paginate<T> {
  return {
    total,
    currentPage: page,
    from: offset,
    to: offset + data.length,
    lastPage: Math.ceil(total / size),
    data
  }
}