import { userGet } from '@functions/user/get';
import { Errors } from '@helpers/http';
import { User } from '@prisma/client';
import { prismaMock } from '@test/prismaMock';

const mockUser = {
	id: 'default',
	email: 'sussy@baka.com',
	nickname: 'iliketrains',
	username: 'sussybaka',
	password: 'password',
	admin: false,
	about: null,
	contact: null,
	profilePhotoUrl: null,
} as User;

beforeEach(() => {});

describe('user find by id', () => {
	it('should find normally :)', async () => {
		prismaMock.user.findFirst.mockResolvedValue(mockUser);
		await expect(
			userGet(
				{
					id: 'default',
				},
				prismaMock,
			),
		).resolves.toStrictEqual({
			email: 'sussy@baka.com',
			nickname: 'iliketrains',
			username: 'sussybaka',
			admin: false,
			about: null,
			contact: null,
			profilePhotoUrl: null,
		});
	});
	it('should fail to find', async () => {
		prismaMock.user.findFirst.mockResolvedValue(null);
		await expect(
			userGet(
				{
					id: 'default',
				},
				prismaMock,
			),
		).rejects.toThrow(Errors.NOT_FOUND());
	});
});
