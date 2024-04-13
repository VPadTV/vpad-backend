import { SubRepository } from '@infrastructure/repositories/sub/SubRepository';
import { SubscriptionTierRepository } from '@infrastructure/repositories/subscriptionTier/SubscriptionTierRepository';
import { Errors } from '@plugins/errors';

export class SubUseCase {
    constructor(
        private subRepository: SubRepository,
        private SubscriptionTierUseCase: SubscriptionTierRepository,
    ) { }
    async createSub(request): Promise<unknown> {
        if (
            typeof request.user.id !== 'string' ||
            typeof request.creatorId !== 'string'
        )
            throw Errors.MISSING_ID();
        return await this.subRepository.create(request);
    }
    async getSubById(id) {
        return this.subRepository.getById(id);
    }
    async getAllSubs(request): Promise<unknown> {
        if (
            typeof request.user.id !== 'string' ||
            typeof request.creatorId !== 'string'
        )
            throw Errors.MISSING_ID();
        return this.subRepository.getAll();
    }
    async updateSub(request): Promise<unknown> {
        if (typeof request.id !== 'string' || typeof request.tierId !== 'string')
            throw Errors.MISSING_ID();

        const tier = await this.SubscriptionTierUseCase.getById(request.tierId);
        if (!tier) throw Errors.BAD_REQUEST();
        request.creatorId = tier.creatorId;
        return this.subRepository.update(request);
    }
    async deleteSub(request) {
        if (typeof request.id !== 'string') throw Errors.MISSING_ID();
        return this.subRepository.delete(request);
    }
}
