export type Json = {
    [key: string | number]: any
}

export type HttpResponse = {
    statusCode: number
    data: Json
}

export const ok = (data: Json): HttpResponse => ({
    statusCode: 200,
    data,
})

export const created = (data: Json): HttpResponse => ({
    statusCode: 201,
    data,
})

export const noContent = (data: Json): HttpResponse => ({
    statusCode: 204,
    data,
})