import express from 'express'
import routes from './routes';

export class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.app.use(express.json({ limit: '10mb' }))

    for (let path in routes) {
      const router = express.Router()
      routes[path].register(router)
      this.app.use(path, router)
    }
  }
}
