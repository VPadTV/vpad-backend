import { userEdit } from "@domain/functions/user/edit"
import { Errors } from "@domain/helpers"
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
  it('should edit normally with valid password', async () => {
    prismaMock.user.update.mockResolvedValue(mockUser)
    await expect(userEdit({
      id: "default",
      password: "sussybaka"
    }, prismaMock, storageMock as any)).resolves.toStrictEqual({ id: "default" })
  })
  it('should edit normally with picture', async () => {
    prismaMock.user.update.mockResolvedValue(mockUser)
    await expect(userEdit({
      id: "default",
      profilePhotoBase64: "sussy",
    }, prismaMock, storageMock as any)).resolves.toStrictEqual({ id: "default" })
  })
  it('should fail invalid username', async () => {
    await expect(userEdit({
      id: "default",
      username: "a"
    }, prismaMock, storageMock as any)).rejects.toThrow(Errors.INVALID_NAME())
  })
  it('should fail invalid nickname', async () => {
    await expect(userEdit({
      id: "default",
      nickname: "a"
    }, prismaMock, storageMock as any)).rejects.toThrow(Errors.INVALID_NAME())
  })
  it('should fail invalid email', async () => {
    await expect(userEdit({
      id: "default",
      email: "a"
    }, prismaMock, storageMock as any)).rejects.toThrow(Errors.INVALID_EMAIL())
  })
  it('should fail invalid password', async () => {
    await expect(userEdit({
      id: "default",
      password: "a"
    }, prismaMock, storageMock as any)).rejects.toThrow(Errors.INVALID_PASSWORD())
  })
})