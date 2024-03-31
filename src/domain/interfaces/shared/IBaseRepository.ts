export interface IBaseRepository<T> {
    getAll (params?: unknown): Promise<T[]>
    getById (id: string): Promise<T>
    create (data: Partial<T>): Promise<T>
    update ( data: Partial<T>, id?: string): Promise<T>
    delete (id: string): Promise<unknown>
}