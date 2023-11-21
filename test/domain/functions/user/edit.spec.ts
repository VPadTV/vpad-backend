import { userEdit } from "@domain/functions/user/edit"
import { User } from "@prisma/client"
import { prismaMock } from "@test/prismaMock"

jest.mock('@infra/gateways/storage')

let storageMock = {
    upload: jest.fn().mockResolvedValue('fakeUrl')
}
const mockUser = {
    id: "default",
    email: "sussy@baka.com",
    nickname: "iliketrains",
    username: "sussybaka",
    password: "password",
} as User

beforeEach(() => {
})

describe('user edit', () => {
    it('should edit normally :)', async () => {
        prismaMock.user.update.mockResolvedValue(mockUser)
        await expect(userEdit({
            id: "default",
            nickname: "iliketrains"
        }, prismaMock, storageMock as any)).resolves.toStrictEqual({ id: "default" })
    })
})