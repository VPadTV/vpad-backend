import { PrismaClient } from '@prisma/client';

export class PrismaUseCase extends PrismaClient {
	constructor() {
		super();
	}
}
