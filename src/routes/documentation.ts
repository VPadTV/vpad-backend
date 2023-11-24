import { IRoute } from "@main/route.ts";
import { Router } from "express";
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "@docs/doc.ts"

export class DocumentationRoute implements IRoute {
  register(router: Router): void {
    router.use('/', swaggerUi.serve)
    router.get('/', swaggerUi.setup(swaggerDocument))
  }
}
