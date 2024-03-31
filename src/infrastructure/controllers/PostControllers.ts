import { Router } from "express"
import { IController } from "@domain/interfaces/shared/IController"
import { ok } from "@plugins/responses"
import { jsonResponse } from "@plugins/jsonResponse"
import { middleware } from "@middlewares/middleware"
import { isLoggedIn } from "@middlewares/isLoggedIn"
import { PostUseCase } from "@domain/use-cases/PostUseCase"





export class PostControllers implements IController {
    constructor(private readonly postUseCase: PostUseCase) { }
    register(router: Router): void {
        router.post('/create',
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.postUseCase.createPost(request))
            }))

        router.get('/:id',
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.postUseCase.getPostById(request))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.postUseCase.updatePost(request))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: any): Promise<any> => {
                return ok(await this.postUseCase.deletePost(request))
            }))

        router.put("vote/:id", middleware(isLoggedIn), jsonResponse(async (request: any): Promise<any> => {
            return ok(await this.postUseCase.voteSet(request))
        }))
    }
}