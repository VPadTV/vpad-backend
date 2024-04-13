import { SubRepository } from '@infrastructure/repositories/sub/SubRepository';
import { SubscriptionTierRepository } from '@infrastructure/repositories/subscriptionTier/SubscriptionTierRepository';
import { Errors } from '@plugins/errors';

export class SubUseCase {
    constructor(
        private subRepo: SubRepository,
        private SubscriptionTierUseCase: SubscriptionTierRepository,
    ) { }
    async createSub(req) {
        if (
            typeof req.user.id !== 'string' ||
            typeof req.creatorId !== 'string'
        )
            throw Errors.MISSING_ID();
        return await this.subRepo.create(req);
    }
    async getSubById(id) {
        return this.subRepo.getById(id);
    }
    async getAllSubs(req) {
        if (
            typeof req.user.id !== 'string' ||
            typeof req.creatorId !== 'string'
        )
            throw Errors.MISSING_ID();
        return this.subRepo.getAll();
    }
    async updateSub(req) {
        if (typeof req.id !== 'string' || typeof req.tierId !== 'string')
            throw Errors.MISSING_ID();

        const tier = await this.SubscriptionTierUseCase.getByIdAndUserId(req.tierId);
        if (!tier) throw Errors.BAD_REQUEST();
        req.creatorId = tier.creatorId;
        return this.subRepo.update(req);
    }
    async deleteSub(req) {
        if (typeof req.id !== 'string') throw Errors.MISSING_ID();
        return this.subRepo.delete(req);
    }
}
