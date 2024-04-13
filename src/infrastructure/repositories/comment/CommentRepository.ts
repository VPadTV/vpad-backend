import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';
import { SimpleUser } from '@plugins/user';

export class CommentRepository {
    constructor(private readonly db: PrismaUseCase) { }
    async create(request): Promise<unknown> {
        return await this.db.comment.create({
            data: request,
            select: { id: true },
        });
    }
    async getAll(request): Promise<unknown[]> {
        const [comments, total] = await this.db.$transaction([
            this.db.comment.findMany({
                where: {
                    postId: request.postId ?? undefined,
                    parentId: request.parentId ?? undefined,
                },
                select: {
                    id: true,
                    text: true,
                    user: { select: SimpleUser.selector },
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { children: true },
                    },
                },
                orderBy: {
                    updatedAt: request.orderByUpdatedAt,
                },
            }),
            this.db.comment.count({
                where: {
                    postId: request.postId ?? undefined,
                    parentId: request.parentId ?? undefined,
                },
            }),
        ]);
        return [comments, total];
    }
    async getById(request): Promise<unknown> {
        return await this.db.comment.findUnique({
            where: { id: request.id },
            select: {
                text: true,
                user: { select: SimpleUser.selector },
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { children: true },
                },
            },
        });
    }
    async update(request): Promise<unknown> {
        return await this.db.comment.update({
            where: { id: request.id, userId: request.user.id },
            data: request,
            select: { text: true, updatedAt: true },
        });
    }
    async delete(request): Promise<unknown> {
        return await this.db.comment.delete({
            where: { id: request.id, userId: request.userId },
        });
    }
}
