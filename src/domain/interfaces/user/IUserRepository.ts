import { IBaseRepository } from "../shared/IBaseRepository";
import {User} from '@prisma/client'

export interface IUserRepository extends IBaseRepository<User> {
    getByEmail(email: string): Promise<User | null>
    userIsBanned(user: User): Promise<{banned: boolean, reason?: string}>
}