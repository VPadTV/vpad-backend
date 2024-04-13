import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';

export class SubRepository {
    constructor(private readonly db: PrismaUseCase) { }
    async getAll(req) {
        const sub = await this.db.subscription.findFirst({
            where: {
                userId: req.user.id,
                creatorId: req.creatorId,
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

    async create(req) {
        await this.db.subscription.create({
            data: {
                userId: req.user.id,
                creatorId: req.creatorId,
                tierId: req.tierId?.length === 0 ? null : req.tierId,
            },
        });

        return {};
    }
    async update(req) {
        await this.db.subscription.update({
            where: {
                id: req.id,
                userId: req.user.id,
                creatorId: req.creatorId,
            },
            data: { tierId: req.tierId },
        });

        return {};
    }
    async delete(req) {
        await this.db.subscription.delete({
            where: { id: req.id, userId: req.user.id },
        });

        return {};
    }
}
