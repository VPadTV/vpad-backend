import http from 'http'
import express from 'express'
import socketio from 'socket.io'
import routes from './routes'
import bodyParser from 'body-parser'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { boolify } from '@plugins/boolify'
import { SocketEvents } from './socketEvents'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    skip: (req) => {
        switch (req.method.toLowerCase()) {
            case 'post':
            case 'put':
            case 'delete':
                return false;
            default:
                return true;
        }
    }
})

export class App {
    server: http.Server
    io: socketio.Server
    public app: express.Application

    constructor() {
        this.app = express()
        this.server = http.createServer(this.app)
        this.io = new socketio.Server(this.server, {
            cors: {
                origin: '*'
            }
        })

        this.app.use(limiter)
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            if (req.method.toLowerCase() === 'get' || boolify(process.env.OPEN_FOR_POST)) {
                next()
            } else {
                res.status(401).send({ error: 'Server is read-only right now' })
            }
        })

        for (let path in routes) {
            const router = express.Router()
            routes[path].register(router)
            this.app.use(path, router)
        }

        this.app.get('/', (_req, res) => {
            res.redirect('/docs')
        })

        SocketEvents.register(this.io)
    }

    start() {
        const port = process.env.PORT ?? 3000

        this.server.listen(port, () =>
            console.log(`[API] Server running at http://localhost:${port}`)
        )
    }
}
