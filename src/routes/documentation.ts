import { IRoute } from "@main/route";
import { Router } from "express";
import fs from "fs"
import YAML from "yaml"
import swaggerUi from "swagger-ui-express"

export class DocumentationRoute implements IRoute {
    register(router: Router): void {
        const file = fs.readFileSync('docs/swagger.yaml', 'utf-8')
        const swaggerDocument = YAML.parse(file)
        
        router.use('/', swaggerUi.serve)
        router.get('/', swaggerUi.setup(swaggerDocument))
    }
}
