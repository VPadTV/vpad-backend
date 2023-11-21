export class HttpError extends Error {
    code: number
    constructor(message: string, code?: number) {
        super(message)
        this.code = code ?? 500
    }
}

export const badRequest = (message: string): HttpError => new HttpError(message, 400)
export const unauthorized = (message: string): HttpError => new HttpError(message, 401)
export const forbidden = (message: string): HttpError => new HttpError(message, 403)
export const notFound = (message: string): HttpError => new HttpError(message, 404)
export const imATeapot = (message: string): HttpError => new HttpError(message, 418)

export const Errors = {
    MISSING_TOKEN: () => unauthorized("Missing token"),
    UNAUTHORIZED: () => unauthorized("Unauthorized"),
    EXPIRED_TOKEN: () => unauthorized("Expired token"),
    FORBIDDEN: () => forbidden("Forbidden"),
    NOT_FOUND: () => notFound("Not Found"),
    IM_A_TEAPOT: () => imATeapot("I'm a teapot!"),
    
    INVALID_TOKEN: () => badRequest("Invalid token"),
    INVALID_NAME: () => badRequest("Invalid name"),
    INVALID_EMAIL: () => badRequest("Invalid email"),
    INVALID_PASSWORD: () => badRequest("Invalid password"),
    INCORRECT_PASSWORD: () => badRequest("Incorrect password"),
    MUST_INCLUDE_EMAIL_OR_USERNAME: () => badRequest("Must include email or username"),
    BANNED: () => forbidden("Banned"),
}