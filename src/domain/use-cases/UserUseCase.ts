import { Errors } from '@plugins/errors';
import {
    emailRegex,
    nicknameRegex,
    passwordRegex,
    usernameRegex,
} from '@plugins/regex';
import { JWT } from '@plugins/jwt';
import bcrypt from 'bcrypt';
import { boolify } from '@plugins/boolify';
import { ImageType, Storage } from '@plugins/storage';
import { FileRawUpload } from '@middlewares/files.types';
import { MediaType } from '@prisma/client';
import { UserRepository } from '@infrastructure/repositories/user/UserRepository';

export class UserUseCase {
    constructor(
        private userRepo: UserRepository,
        private readonly storage: Storage,
    ) { }

    async registerUser(req) {
        if (!req.username || !req.email || !req.password) {
            throw Errors.INVALID_FILE();
        }

        if (!usernameRegex().test(req.username)) {
            throw Errors.INVALID_USERNAME();
        }

        if (req.nickname && !nicknameRegex().test(req.nickname)) {
            throw Errors.INVALID_NICKNAME();
        }

        if (!emailRegex().test(req.email)) {
            throw Errors.INVALID_EMAIL();
        }

        if (!passwordRegex().test(req.password)) {
            throw Errors.INVALID_PASSWORD();
        }

        const user = await this.userRepo.getByEmail(req.email);

        if (user) {
            throw Errors.USERNAME_ALREADY_EXISTS();
        }

        const hashedPassword = await bcrypt.hash(req.password, 10);

        const newUser = await this.userRepo.create({
            username: req.username,
            nickname: req.nickname || req.username,
            email: req.email,
            password: hashedPassword,
            about: req.about,
        });

        const token = JWT.newToken(newUser);
        return { id: newUser.id, token };
    }
    async loginUser(req) {
        if (!req.emailOrUsername || !req.password) {
            throw Errors.INVALID_FILE();
        }

        const user = await this.userRepo.getByEmail(req.emailOrUsername);

        if (!user) {
            throw Errors.NOT_FOUND();
        }

        const valid = await bcrypt.compare(req.password, user.password);

        if (!valid) {
            throw Errors.INVALID_PASSWORD();
        }

        if (await this.userRepo.userIsBanned(user)) throw Errors.BANNED();

        const token = JWT.newToken(user);
        return { id: user.id, token };
    }

    async manageBan(req) {
        if (!req.id || req.banned === undefined) {
            throw Errors.BAD_REQUEST();
        }

        const user = await this.userRepo.getById(req.id);

        if (!user) {
            throw Errors.NOT_FOUND();
        }

        if (user.admin) {
            throw Errors.BAD_REQUEST();
        }

        user.banned = req.banned;
        user.banTimeout = req.banTimeout || null;

        await this.userRepo.update(user);

        return { id: user.id, banned: user.banned, banTimeout: user.banTimeout };
    }

    async getUsers(req) {
        req.banned = boolify(req.banned);
        const users = await this.userRepo.getAll(req);
        if (!users) throw Errors.NOT_FOUND();
        return { users };
    }

    async getUserById(req) {
        const user = await this.userRepo.getById(req);
        if (!user) throw Errors.NOT_FOUND();
        return user;
    }

    async updateUser(req) {
        if (req.username !== null && !usernameRegex().test(req.username))
            throw Errors.INVALID_USERNAME();
        if (req.nickname !== null && !usernameRegex().test(req.nickname))
            throw Errors.INVALID_NICKNAME();
        if (req.email !== null && !usernameRegex().test(req.email))
            throw Errors.INVALID_EMAIL();
        if (req.password !== null && !usernameRegex().test(req.password))
            throw Errors.INVALID_PASSWORD();
        const profilePhotoData = await this.storage.getFileData(
            req.profilePhotoUrl as FileRawUpload,
            ImageType.THUMBNAIL,
        );
        if (profilePhotoData?.type === MediaType.VIDEO) throw Errors.INVALID_FILE();
        const found = await this.getUserById(req);
        if (!found) throw Errors.INVALID_ID();
        req = {
            ...req,
            profilePhotoData,
        };
        const repoResponse = await this.userRepo.update(req);
        await this.storage.upload(req.profilePhotoData);
        return repoResponse
    }

    async deleteUser(req) {
        return await this.userRepo.delete(req);
    }
}
