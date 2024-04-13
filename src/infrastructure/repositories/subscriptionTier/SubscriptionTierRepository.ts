import { Decimal } from '@prisma/client/runtime/library';
import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';

export class SubscriptionTierRepository {
    constructor(private readonly db: PrismaUseCase) { }

    async create(request): Promise<unknown> {
        const tier = await this.db.subscriptionTier.create({
            data: {
                creatorId: request.user.id,
                name: request.name,
                price: new Decimal(request.price),
            },
            select: { id: true },
        });

        return { id: tier.id };
    }
    async getById(request): Promise<unknown> {
        const tier = await this.db.subscriptionTier.findFirst({
            where: { id: request.id, creatorId: request.user.id },
            select: { id: true },
        });
        return tier;
    }
    async getAll(request): Promise<unknown[]> {
        const tiers = await this.db.subscriptionTier.findMany({
            where: { creatorId: request.creatorId },
            select: {
                name: true,
                price: true,
            },
        });

        return tiers.map((tier) => ({
            name: tier.name,
            price: tier.price.toNumber(),
        })) as unknown[];
    }
    async update(request): Promise<unknown> {
        await this.db.subscriptionTier.update({
            where: { id: request.id, creatorId: request.user.id },
            data: { name: request.name },
            select: { id: true },
        });
        return {};
    }
    async delete(request): Promise<unknown> {
        await this.db.subscriptionTier.delete({
            where: { id: request.id, creatorId: request.user.id },
        });

        return {};
    }
}
