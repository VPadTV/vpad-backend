import { Router } from "express";
import { IController } from "@domain/interfaces/shared/IController";
import { isLoggedIn } from "@middlewares/isLoggedIn";
import { middleware } from "@middlewares/middleware";
import { jsonResponse } from "@plugins/jsonResponse";
import { ok } from "@plugins/responses";
import { SubUseCase } from "@domain/use-cases/SubUseCase";


export class SubControllers implements IController {
    constructor(private readonly SubUseCase: SubUseCase) { }
    register(router: Router): void {
        router.post('/create',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.SubUseCase.createSub(request))
            }))

        router.get('/:creatorId',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.SubUseCase.getAllSubs(request))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.SubUseCase.updateSub(request))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.SubUseCase.deleteSub(request))
            }))
    }

}