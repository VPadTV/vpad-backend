import express from 'express'
import routes from './routes';
import bodyParser from 'body-parser';
import cors from 'cors'

export class App {
    public server: express.Application

    constructor() {
        this.server = express()
        // this.server.use(express.json({ limit: '10mb' }))
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(cors({
            origin: 'http://localhost:5173',
            credentials: true
        }))

        for (let path in routes) {
            const router = express.Router()
            routes[path].register(router)
            this.server.use(path, router)
        }
    }
}
