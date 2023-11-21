import { userLogin } from "@domain/functions/user/login"
import { JwtGateway } from "@infra/gateways"
import { User } from "@prisma/client"
import { prismaMock } from "@test/prismaMock"

jest.mock('@infra/gateways/jwt')
jest.mock('bcrypt', () => {
    return {
        compare: () => true
    }
})

beforeEach(() => {
    jest.spyOn(JwtGateway, 'newToken').mockReturnValue('token')
})

describe('user login', () => {
    it('should login normally :)', async () => {
        prismaMock.user.findFirst.mockResolvedValue({
            id: "default",
            password: "sussybaka"
        } as User)
        await expect(userLogin({
            username: "iliketrains",
            password: "sussybaka"
        }, prismaMock)).resolves.toStrictEqual({ token: "token" })
    })
})