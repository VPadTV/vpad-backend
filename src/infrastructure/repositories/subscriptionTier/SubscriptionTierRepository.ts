import { Decimal } from '@prisma/client/runtime/library';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';

export class SubscriptionTierRepository {
    constructor(private readonly db: PrismaUseCase) { }

    async create(req) {
        const tier = await this.db.subscriptionTier.create({
            data: {
                creatorId: req.user.id,
                name: req.name,
                price: new Decimal(req.price),
            },
            select: { id: true },
        });

        return { id: tier.id };
    }
    async getByIdAndUserId(req) {
        const tier = await this.db.subscriptionTier.findFirst({
            where: { id: req.id, creatorId: req.userId },
            select: { price: true },
        });
        return tier;
    }
    async getAll(req) {
        const tiers = await this.db.subscriptionTier.findMany({
            where: { creatorId: req.creatorId },
            select: {
                name: true,
                price: true,
            },
        });

        return tiers.map((tier) => ({
            name: tier.name,
            price: tier.price.toNumber(),
        }));
    }
    async update(req) {
        await this.db.subscriptionTier.update({
            where: { id: req.id, creatorId: req.user.id },
            data: { name: req.name },
            select: { id: true },
        });
        return {};
    }
    async delete(req) {
        await this.db.subscriptionTier.delete({
            where: { id: req.id, creatorId: req.user.id },
        });

        return {};
    }
}
