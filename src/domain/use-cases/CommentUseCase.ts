import { paginate } from '@plugins/paginate';
import { ICommentRepository } from '../interfaces/comment/ICommentRepository';
import { Errors } from '@plugins/errors';

export class CommentUseCase {
	constructor(private commentRepository: ICommentRepository) {}
	async createComment(request: any): Promise<unknown> {
		if (request.postId) throw Errors.MISSING_ID();
		if (request.text) throw Errors.MISSING_TEXT();
		return await this.commentRepository.create(request);
	}
	async getComments(request: any): Promise<unknown> {
		const offset = (request.page - 1) * request.size;
		const orderByUpdatedAt = request.sortBy === 'oldest' ? 'asc' : 'desc';
		request.orderByUpdatedAt = orderByUpdatedAt;
		const [comments, total] = await this.commentRepository.getAll(request);

		return paginate(
			total as number, // Cast 'total' to 'number'
			request.page,
			offset,
			request.size,
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
	async getCommentById(request: any): Promise<unknown> {
		const comment = await this.commentRepository.getById(request);
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
	async updateComment(request: any): Promise<unknown> {
		if (!request.id) throw Errors.MISSING_ID();
		if (!request.text) throw Errors.MISSING_TEXT();
		return await this.commentRepository.update(request);
	}
	async deleteComment(id): Promise<void> {
		const response = this.commentRepository.delete(id);
		if (!response) throw Errors.NOT_FOUND();
	}
}
