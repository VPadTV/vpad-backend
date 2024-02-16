import express from 'express'
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { boolify } from '@helpers/boolify';
import { lockServer } from '@infra/middlewares/lock';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    skip: (req) => req.method.toLowerCase() !== 'post'
})

export class App {
    public server: express.Application

    constructor() {
        this.server = express()
        this.server.use(limiter)
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cors())
        this.server.use(lockServer('SERVER_READ_ONLY'))

        for (let path in routes) {
            const router = express.Router()
            routes[path].register(router)
            this.server.use(path, router)
        }
    }
}
