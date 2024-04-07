import { IBaseRepository } from '../shared/IBaseRepository';
import { User } from '@prisma/client';

export interface IUserRepository extends IBaseRepository<unknown> {
	getByEmail(email: string): Promise<unknown>;
	userIsBanned(user: User): Promise<{ banned: boolean; reason?: string }>;
}
