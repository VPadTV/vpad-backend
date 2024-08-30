import { Errors } from '@plugins/http'
import { User } from '@prisma/client'
import Jwt from 'jsonwebtoken'

export type DecodeOutput = {
    id: string
    exp: number
}

export type JWTClient = typeof Jwt

export abstract class JWT {
    private static defaultExpiry() {
        return Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }

    public static decode(token: string): DecodeOutput {
        const decoded = Jwt.decode(token) as Jwt.JwtPayload

        if (!decoded || !decoded.sub || !decoded.exp)
            throw Errors.INVALID_TOKEN()

        const now = Date.now()
        if (now > decoded.exp) throw Errors.EXPIRED_TOKEN()

        const id = decoded.sub.split('#')[0]
        if (!id) throw Errors.INVALID_TOKEN()

        return {
            id,
            exp: decoded.exp,
        }
    }

    public static newToken(user: User) {
        return Jwt.sign({
            sub: user.id.toString() + '#' + user.username,
            exp: JWT.defaultExpiry()
        }, process.env.SECRET as string)
    }
}
