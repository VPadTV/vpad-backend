import { userLogin } from '@functions/user/login'
import { Errors } from '@helpers/http'
import { JwtGateway } from '@infra/gateways'
import { User } from '@prisma/client'
import { prismaMock } from '@test/prismaMock'
import bcrypt from 'bcrypt'

jest.mock('@infra/gateways/jwt')
jest.mock('bcrypt')

beforeEach(() => {
    jest.spyOn(JwtGateway, 'newToken').mockReturnValue('token')
    bcrypt.compare = jest.fn().mockResolvedValue(true)
})

describe('user login', () => {
    it('should login normally with username :)', async () => {
        prismaMock.user.findFirst.mockResolvedValue({
            id: 'default',
            password: 'sussybaka'
        } as User)
        await expect(userLogin({
            username: 'iliketrains',
            password: 'sussybaka'
        }, prismaMock)).resolves.toStrictEqual({ id: 'default', token: 'token' })
    })

    it('should login normally with email :)', async () => {
        prismaMock.user.findFirst.mockResolvedValue({
            id: 'default',
            password: 'sussybaka'
        } as User)
        await expect(userLogin({
            email: 'ilike@trains.com',
            password: 'sussybaka'
        }, prismaMock)).resolves.toStrictEqual({ id: 'default', token: 'token' })
    })

    it('should fail - no username or email', async () => {
        await expect(userLogin({
            password: 'sussybaka'
        }, prismaMock)).rejects.toThrow(Errors.MUST_INCLUDE_EMAIL_OR_USERNAME())
    })

    it('should fail - not found', async () => {
        prismaMock.user.findFirst.mockResolvedValue(null)
        await expect(userLogin({
            email: 'ilike@trains.com',
            password: 'sussybaka'
        }, prismaMock)).rejects.toThrow(Errors.NOT_FOUND())
    })

    it('should fail - incorrect password', async () => {
        bcrypt.compare = jest.fn().mockResolvedValue(false)
        prismaMock.user.findFirst.mockResolvedValue({
            id: 'default',
            password: 'sussybaka'
        } as User)
        await expect(userLogin({
            email: 'ilike@trains.com',
            password: 'sussybaka'
        }, prismaMock)).rejects.toThrow(Errors.INCORRECT_PASSWORD())
    })
})