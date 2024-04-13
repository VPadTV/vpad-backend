import { IBaseRepository } from '../shared/IBaseRepository';

export interface IPostRepository extends IBaseRepository<unknown> {
	voteSet(request: any): Promise<unknown>;
}
