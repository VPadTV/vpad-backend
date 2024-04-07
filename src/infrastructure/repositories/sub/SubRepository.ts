import { ISubRepository } from '@domain/interfaces/sub/ISubRepository';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';

export class SubRepository implements ISubRepository {
	constructor(private readonly db: PrismaUseCase) {}
	async getAll(request: any): Promise<unknown[]> {
		const sub = await this.db.subscription.findFirst({
			where: {
				userId: request.user.id,
				creatorId: request.creatorId,
			},
			select: {
				id: true,
				tier: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return [sub];
	}
	getById(request: any): Promise<unknown> {
		throw new Error('Method not implemented.');
	}
	async create(request: any): Promise<unknown> {
		await this.db.subscription.create({
			data: {
				userId: request.user.id,
				creatorId: request.creatorId,
				tierId: request.tierId?.length === 0 ? null : request.tierId,
			},
		});

		return {};
	}
	async update(request: any): Promise<unknown> {
		await this.db.subscription.update({
			where: {
				id: request.id,
				userId: request.user.id,
				creatorId: request.creatorId,
			},
			data: { tierId: request.tierId },
		});

		return {};
	}
	async delete(request: any): Promise<unknown> {
		await this.db.subscription.delete({
			where: { id: request.id, userId: request.user.id },
		});

		return {};
	}
}
