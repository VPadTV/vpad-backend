import { Router } from 'express';
import { IController } from '@domain/interfaces/shared/IController';
import { middleware } from '@middlewares/middleware';
import { isLoggedIn } from '@middlewares/isLoggedIn';
import { jsonResponse } from '@plugins/jsonResponse';
import { HttpResponse, ok } from '@plugins/responses';
import { SubscriptionTierUseCase } from '@domain/use-cases/SubscriptionTierUseCase';

export class SubscriptionTierControllers implements IController {
    constructor(
        private readonly subscriptionTierUseCase: SubscriptionTierUseCase,
    ) { }
    register(router: Router): void {
        router.post(
            '/create',
            middleware(isLoggedIn),
            jsonResponse(async (request) => {
                return ok(
                    await this.subscriptionTierUseCase.createSubscriptionTier(request),
                );
            }),
        );

        router.get(
            '/:id',
            jsonResponse(async (request) => {
                return ok(
                    await this.subscriptionTierUseCase.getSubscriptionTierById(request),
                );
            }),
        );

        router.put(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request): Promise<HttpResponse> => {
                return ok(
                    await this.subscriptionTierUseCase.updateSubscriptionTier(request),
                );
            }),
        );

        router.delete(
            '/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request): Promise<HttpResponse> => {
                return ok(
                    await this.subscriptionTierUseCase.deleteSubscriptionTier(request),
                );
            }),
        );
    }
}
