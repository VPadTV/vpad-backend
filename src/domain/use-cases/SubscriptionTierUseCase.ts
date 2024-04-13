import { validString } from '@plugins/validString';
import { Errors } from '@plugins/errors';
import { numify } from '@plugins/numify';
import { SubscriptionTierRepository } from '@infrastructure/repositories/subscriptionTier/SubscriptionTierRepository';

export class SubscriptionTierUseCase {
    constructor(
        private subscriptionTierRepository: SubscriptionTierRepository,
    ) { }
    async createSubscriptionTier(request) {
        if (typeof request.user.id !== 'string') throw Errors.MISSING_ID();
        if (!validString(request.name)) throw Errors.MISSING_NAME();
        const price = numify(request.price);
        if (price === undefined) throw Errors.MISSING_PRICE();
        return await this.subscriptionTierRepository.create(request);
    }
    async getAllSubscriptionTiers(request) {
        if (typeof request.creatorId !== 'string') throw Errors.MISSING_ID();
        return await this.subscriptionTierRepository.getAll(request);
    }
    async updateSubscriptionTier(request) {
        if (typeof request.id !== 'string') throw Errors.MISSING_ID();
        if (!validString(request.name)) throw Errors.MISSING_NAME();
        return await this.subscriptionTierRepository.update(request);
    }
    async deleteSubscriptionTier(request) {
        if (typeof request.id !== 'string') throw Errors.MISSING_ID();
        return await this.subscriptionTierRepository.delete(request);
    }
}
