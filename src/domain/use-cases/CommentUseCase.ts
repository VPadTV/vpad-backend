import { paginate } from '@plugins/paginate';
import { Errors } from '@plugins/errors';
import { CommentRepository } from '@infrastructure/repositories/comment/CommentRepository';

export class CommentUseCase {
    constructor(private commentRepo: CommentRepository) { }
    async createComment(req) {
        if (req.postId) throw Errors.MISSING_ID();
        if (req.text) throw Errors.MISSING_TEXT();
        return await this.commentRepo.create(req);
    }
    async getComments(req) {
        const offset = (req.page - 1) * req.size;
        const orderByUpdatedAt = req.sortBy === 'oldest' ? 'asc' : 'desc';
        req.orderByUpdatedAt = orderByUpdatedAt;
        const { comments, total } = await this.commentRepo.getAll(req);

        return paginate(
            total as number, // Cast 'total' to 'number'
            req.page,
            offset,
            req.size,
            comments.map((comment) => ({
                id: comment.id,
                text: comment.text,
                childrenCount: comment._count.children,
                meta: {
                    user: comment.user,
                    createdAt: comment.createdAt.toISOString(),
                    updatedAt: comment.updatedAt.toISOString(),
                },
            })),
        );
    }
    async getCommentById(req) {
        const comment = await this.commentRepo.getById(req);
        if (!comment) throw Errors.NOT_FOUND();
        return {
            text: comment.text,
            childrenCount: comment._count.children,
            meta: {
                user: comment.user,
                createdAt: comment.createdAt.toISOString(),
                updatedAt: comment.updatedAt.toISOString(),
            },
        };
    }
    async updateComment(req) {
        if (!req.id) throw Errors.MISSING_ID();
        if (!req.text) throw Errors.MISSING_TEXT();
        return await this.commentRepo.update(req);
    }
    async deleteComment(id): Promise<void> {
        const response = this.commentRepo.delete(id);
        if (!response) throw Errors.NOT_FOUND();
    }
}
