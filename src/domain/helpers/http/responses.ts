export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export const ok = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  data,
})

export const created = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 201,
  data,
})

export const noContent = <T = any>(data: T): HttpResponse<T> => ({
  statusCode: 204,
  data,
})