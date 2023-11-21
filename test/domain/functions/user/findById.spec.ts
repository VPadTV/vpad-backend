import { userFindById } from "@domain/functions/user/findById"
import { User } from "@prisma/client"
import { prismaMock } from "@test/prismaMock"

const mockUser = {
    id: "default",
    email: "sussy@baka.com",
    nickname: "iliketrains",
    username: "sussybaka",
    password: "password",
    admin: false,
    about: null,
    contact: null,
    profilePhotoUrl: null
} as User

beforeEach(() => {
})

describe('user find by id', () => {
    it('should find normally :)', async () => {
        prismaMock.user.findFirst.mockResolvedValue(mockUser)
        await expect(userFindById({
            id: "default"
        }, prismaMock)).resolves.toStrictEqual({
            email: "sussy@baka.com",
            nickname: "iliketrains",
            username: "sussybaka",
            admin: false,
            about: null,
            contact: null,
            profilePhotoUrl: null
        })
    })
})