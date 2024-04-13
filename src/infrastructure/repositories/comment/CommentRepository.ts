import { PrismaUseCase } from '@domain/use-cases/PrismaUseCase';
import { SimpleUser } from '@plugins/user';

export class CommentRepository {
    constructor(private readonly db: PrismaUseCase) { }
    async create(req) {
        return await this.db.comment.create({
            data: req,
            select: { id: true },
        });
    }
    async getAll(req) {
        const [comments, total] = await this.db.$transaction([
            this.db.comment.findMany({
                where: {
                    postId: req.postId ?? undefined,
                    parentId: req.parentId ?? undefined,
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
                    updatedAt: req.orderByUpdatedAt,
                },
            }),
            this.db.comment.count({
                where: {
                    postId: req.postId ?? undefined,
                    parentId: req.parentId ?? undefined,
                },
            }),
        ]);
        return { comments, total };
    }
    async getById(req) {
        return await this.db.comment.findUnique({
            where: { id: req.id },
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
    async update(req) {
        return await this.db.comment.update({
            where: { id: req.id, userId: req.user.id },
            data: req,
            select: { text: true, updatedAt: true },
        });
    }
    async delete(req) {
        return await this.db.comment.delete({
            where: { id: req.id, userId: req.userId },
        });
    }
}
