
import { Errors } from "@plugins/errors";
import { IUserRepository } from "../interfaces/user/IUserRepository"
import { emailRegex, nicknameRegex, passwordRegex, usernameRegex } from "@plugins/regex";
import { JWT } from "@plugins/jwt";
import bcrypt from 'bcrypt'
import { boolify } from "@plugins/boolify";
import { ImageType, Storage } from "@plugins/storage";
import { FileRawUpload } from "@middlewares/files.types";
import { MediaType } from "@prisma/client";

export class UserUseCase {
    constructor(private userRepository: IUserRepository, private readonly storage: Storage) { }

    async registerUser(request: any): Promise<any> {
        if (!request.username || !request.email || !request.password) {
            throw Errors.INVALID_FILE();
        }

        if (!usernameRegex().test(request.username)) {
            throw Errors.INVALID_USERNAME();
        }

        if (request.nickname && !nicknameRegex().test(request.nickname)) {
            throw Errors.INVALID_NICKNAME();
        }

        if (!emailRegex().test(request.email)) {
            throw Errors.INVALID_EMAIL();
        }

        if (!passwordRegex().test(request.password)) {
            throw Errors.INVALID_PASSWORD();
        }

        const user = await this.userRepository.getByEmail(request.email);

        if (user) {
            throw Errors.USERNAME_ALREADY_EXISTS();
        }

        const hashedPassword = await bcrypt.hash(request.password, 10);

        const newUser = await this.userRepository.create({
            username: request.username,
            nickname: request.nickname || request.username,
            email: request.email,
            password: hashedPassword,
            about: request.about
        });

        const token = JWT.newToken(newUser);
        return { id: newUser.id, token };
    }
    async loginUser(request: any): Promise<any> {
        if (!request.emailOrUsername || !request.password) {
            throw Errors.INVALID_FILE();
        }

        const user = await this.userRepository.getByEmail(request.emailOrUsername);

        if (!user) {
            throw Errors.NOT_FOUND();
        }

        const valid = await bcrypt.compare(request.password, user.password);

        if (!valid) {
            throw Errors.INVALID_PASSWORD();
        }

        if ((await this.userRepository.userIsBanned(user))) throw Errors.BANNED()

        const token = JWT.newToken(user);
        return { id: user.id, token };
    }

    async manageBan(request: any): Promise<any> {

        if (!request.id || request.banned === undefined) {
            throw Errors.BAD_REQUEST();
        }

        const user = await this.userRepository.getById(request.id);

        if (!user) {
            throw Errors.NOT_FOUND();
        }

        if (user.admin) {
            throw Errors.BAD_REQUEST();
        }

        user.banned = request.banned;
        user.banTimeout = request.banTimeout || null;

        await this.userRepository.update(user);

        return { id: user.id, banned: user.banned, banTimeout: user.banTimeout };
    }

    async getUsers(request: any): Promise<any> {
        request.banned = boolify(request.banned)
        const users = await this.userRepository.getAll()
        if (!users) throw Errors.NOT_FOUND()
        return { users }
    }

    async getUserById(request: any): Promise<any> {
        const user = await this.userRepository.getById(request)
        if (!user) throw Errors.NOT_FOUND()
        return user
    }

    async updateUser(request: any): Promise<any> {
        if ((request.username) !== null && !usernameRegex().test(request.username)) throw Errors.INVALID_USERNAME()
        if (request.nickname !== null && !usernameRegex().test(request.nickname)) throw Errors.INVALID_NICKNAME()
        if (request.email !== null && !usernameRegex().test(request.email)) throw Errors.INVALID_EMAIL()
        if (request.password !== null && !usernameRegex().test(request.password)) throw Errors.INVALID_PASSWORD()
        const profilePhotoData = await this.storage.getFileData(request.profilePhotoUrl as unknown as FileRawUpload, ImageType.THUMBNAIL)
        if (profilePhotoData?.type === MediaType.VIDEO) throw Errors.INVALID_FILE()
        const found = await this.getUserById(request)
        if(!found) throw Errors.INVALID_ID()
        request = {
            ...request,
            profilePhotoData
        }
        return await this.userRepository.update(request)
    }

    async deleteUser(request: any): Promise<any> {
        return await this.userRepository.delete(request)
    }
}