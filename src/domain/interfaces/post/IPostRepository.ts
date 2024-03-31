import { IBaseRepository } from "../shared/IBaseRepository";

export interface IPostRepository extends IBaseRepository<any> {
    voteSet(request: any): Promise<any>
}