import { UserControllers } from "@infrastructure/controllers/UserControllers";
import { UserRepository } from "@infrastructure/repositories/user/UserRepository";
import { PrismaUseCase } from "@domain/use-cases/PrismaUseCase";
import { Storage } from "@plugins/storage";
import { SubControllers } from "@infrastructure/controllers/SubControllers";
import { CommentRepository } from "@infrastructure/repositories/comment/CommentRepository";
import { PostControllers } from "@infrastructure/controllers/PostControllers";
import { PostRepository } from "@infrastructure/repositories/post/PostRepository";
import { SubscriptionTierControllers } from "@infrastructure/controllers/SubscriptionTierControllers";
import { SubscriptionTierRepository } from "@infrastructure/repositories/subscriptionTier/SubscriptionTierRepository";
import { CommentControllers } from "@infrastructure/controllers/CommentControllers";
import { DocumentationRoute } from "@routes/documentation";
import { IRoute } from "./route";
import { UserUseCase } from "@domain/use-cases/UserUseCase";
import { PostUseCase } from "@domain/use-cases/PostUseCase";
import { SubscriptionTierUseCase } from "@domain/use-cases/SubscriptionTierUseCase";
import { CommentUseCase } from "@domain/use-cases/CommentUseCase";
import { SubUseCase } from "@domain/use-cases/SubUseCase";
import { SubRepository } from "@infrastructure/repositories/sub/SubRepository";


const prismaUseCase = new PrismaUseCase();
const storage = new Storage();
const userRepository = new UserRepository(prismaUseCase, storage);
const subscriptionTierRepository = new SubscriptionTierRepository(prismaUseCase);


export default {
    '/user': new UserControllers(new UserUseCase(userRepository, storage)), // admin changed to user
    '/docs': new DocumentationRoute(),
    '/post': new PostControllers(
        new PostUseCase(
            new PostRepository(prismaUseCase, storage),
            subscriptionTierRepository,
            prismaUseCase,
            storage
        )
    ), // vote changed to post
    '/comment': new CommentControllers(new CommentUseCase(new CommentRepository(prismaUseCase))),
    '/tier': new SubscriptionTierControllers(new SubscriptionTierUseCase(subscriptionTierRepository)),
    '/sub': new SubControllers(
        new SubUseCase(
            new SubRepository(prismaUseCase),
            subscriptionTierRepository
        )
    ),
    // '/pay': new PayRoute(),
} as { [path: string]: IRoute }