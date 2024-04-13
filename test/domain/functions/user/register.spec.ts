import { userRegister } from '@functions/user/register';
import { Errors } from '@helpers/http';
import { User } from '@prisma/client';
import { prismaMock } from '@test/prismaMock';

jest.mock('@infra/gateways/storage');

const mockUser = {
	id: 'default',
	email: 'sussy@baka.com',
	nickname: 'iliketrains',
	username: 'sussybaka',
	password: 'password',
} as User;

beforeEach(() => {});

describe('user register', () => {
	it('should register normally :)', async () => {
		prismaMock.user.create.mockResolvedValue(mockUser);
		await expect(
			userRegister(
				{
					name: 'iliketrains',
					email: 'email@domain.com',
					password: 'password',
				},
				prismaMock,
			),
		).resolves.toStrictEqual({ id: 'default' });
	});
	it('should register normally with about :)', async () => {
		prismaMock.user.create.mockResolvedValue(mockUser);
		await expect(
			userRegister(
				{
					name: 'iliketrains',
					email: 'email@domain.com',
					about: 'i like trains ^-^',
					password: 'password',
				},
				prismaMock,
			),
		).resolves.toStrictEqual({ id: 'default' });
	});
	it('should fail invalid email', async () => {
		await expect(
			userRegister(
				{
					name: 'iliketrains',
					email: 'a',
					password: 'password',
				},
				prismaMock,
			),
		).rejects.toThrow(Errors.INVALID_EMAIL());
	});
	it('should fail invalid email', async () => {
		await expect(
			userRegister(
				{
					name: 'a',
					email: 'email@domain.com',
					password: 'password',
				},
				prismaMock,
			),
		).rejects.toThrow(Errors.INVALID_NAME());
	});
	it('should fail invalid email', async () => {
		await expect(
			userRegister(
				{
					name: 'iliketrains',
					email: 'email@domain.com',
					password: 'a',
				},
				prismaMock,
			),
		).rejects.toThrow(Errors.INVALID_PASSWORD());
	});
});
