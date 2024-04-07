import { validString } from '@plugins/validString';
import { ISubscriptionTierRepository } from '../interfaces/subscriptionTier/ISubscriptionTierRepository';
import { Errors } from '@plugins/errors';
import { numify } from '@plugins/numify';

export class SubscriptionTierUseCase {
	constructor(
		private subscriptionTierRepository: ISubscriptionTierRepository,
	) {}
	async createSubscriptionTier(request: any): Promise<unknown> {
		if (typeof request.user.id !== 'string') throw Errors.MISSING_ID();
		if (!validString(request.name)) throw Errors.MISSING_NAME();
		const price = numify(request.price);
		if (price === undefined) throw Errors.MISSING_PRICE();
		return await this.subscriptionTierRepository.create(request);
	}
	async getSubscriptionTierById(request: any): Promise<unknown> {
		return await this.subscriptionTierRepository.getById(request);
	}
	async getAllSubscriptionTiers(request: any): Promise<unknown> {
		if (typeof request.creatorId !== 'string') throw Errors.MISSING_ID();
		return await this.subscriptionTierRepository.getAll(request);
	}
	async updateSubscriptionTier(request: any): Promise<unknown> {
		if (typeof request.id !== 'string') throw Errors.MISSING_ID();
		if (!validString(request.name)) throw Errors.MISSING_NAME();
		return await this.subscriptionTierRepository.update(request);
	}
	async deleteSubscriptionTier(request: any): Promise<unknown> {
		if (typeof request.id !== 'string') throw Errors.MISSING_ID();
		return await this.subscriptionTierRepository.delete(request);
	}
}
