import { JwtGateway } from "@infra/gateways"
import { User } from "@prisma/client"
// import Jwt from 'jsonwebtoken'

// jest.mock('jsonwebtoken')


const mockUser = {
    id: "default",
    username: "sussybaka",
} as User

// beforeEach(() => {
//     Jwt.sign = jest.fn().mockReturnValue('signed')
//     Jwt.decode = jest.fn().mockReturnValue({ sub: 'default#sussybaka' })
// })

describe('jwt gateway', () => {
    it('should create token and verifty it :)', async () => {
        const token = JwtGateway.newToken(mockUser)
        const decoded = JwtGateway.decode(token)
        expect(decoded.sub).toStrictEqual('default#sussybaka')
        expect(typeof decoded.exp).toBe('number')
        expect(typeof decoded.iat).toBe('number')
    })

    // it('should create token normally :)', async () => {
    //     expect(JwtGateway.newToken(mockUser)).toBe('signed')
    // })
    // it('should verify token normally :)', async () => {
    //     expect(JwtGateway.decode(token)).toStrictEqual({
    //         sub: 'default#sussybaka'
    //     })
    // })
})