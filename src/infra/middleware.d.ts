declare namespace Express {
    export interface Request {
        middleware?: { [key: string]: unknown }
    }
}