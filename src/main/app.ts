import express from 'express'
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export class App {
    public server: express.Application

    constructor() {
        this.server = express()
        this.server.use(limiter)
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cors())
        this.server.use((req, res, next) => {
            if (req.method.toLowerCase() === 'get' || process.env.OPEN_FOR_POST) {
                next()
            } else {
                res.status(401).send({ error: 'Server is read-only right now' })
            }
        })

        for (let path in routes) {
            const router = express.Router()
            routes[path].register(router)
            this.server.use(path, router)
        }
    }
}
