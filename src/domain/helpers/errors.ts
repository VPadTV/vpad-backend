export type Error = {
    key: string,
    statusCode: number
}

export const badRequest = (key: string): Error => ({
    statusCode: 400,
    key,
})

export const unauthorized = (key: string): Error => ({
    statusCode: 401,
    key,
})

export const forbidden = (key: string): Error => ({
    statusCode: 403,
    key,
})

export const notFound = (key: string): Error => ({
    statusCode: 404,
    key,
})

export const imATeapot = (key: string): Error => ({
    statusCode: 418,
    key,
})

export const ErrorMessage = {
    UNAUTHORIZED: unauthorized('UNAUTHORIZED'),
    FORBIDDEN: unauthorized('FORBIDDEN'),
    NOT_FOUND: unauthorized('NOT_FOUND'),
    IM_A_TEAPOT: unauthorized('IM_A_TEAPOT'),
    
    INVALID_NAME: badRequest('INVALID_NAME'),
    INVALID_TOKEN: badRequest('INVALID_TOKEN')
}