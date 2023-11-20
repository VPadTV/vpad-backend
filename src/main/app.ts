import express from 'express'
import { IRoute } from './route';
import { ExampleRoute } from '@controllers/example';

export class App {
  public app: express.Application

  static makeRoutes(): IRoute[] {
    return [
      new ExampleRoute(),
    ]
  }

  constructor() {
    this.app = express()
    this.app.use(express.json({ limit: '10mb' }))
    
    const controllers = App.makeRoutes()
    controllers.forEach(route => {
      const router = express.Router()
      route.register(router)
      this.app.use(route.prefix, router)
    });
  }
}
