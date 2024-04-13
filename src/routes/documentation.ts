import { IRoute } from '@main/route';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '@docs/doc';

export class DocumentationRoute implements IRoute {
	register(router: Router): void {
		router.use('/', swaggerUi.serve);
		router.get('/', swaggerUi.setup(swaggerDocument));
	}
}
