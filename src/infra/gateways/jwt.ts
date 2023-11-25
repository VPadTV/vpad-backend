import { User } from '@prisma/client'
import Jwt, { Secret } from 'jsonwebtoken'

export type SignInput = {
    sub: string
    exp?: number
    secretKey: Secret
}

export type JWTClient = typeof Jwt

export abstract class JWT {
    private static defaultExpiry() {
        return Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    }

    public static decode(token: string): Jwt.JwtPayload {
        const decoded = Jwt.decode(token) as Jwt.JwtPayload
        return decoded
    }

    public static newToken(user: User) {
        return this.sign({
            sub: user.id.toString() + '#' + user.username,
            secretKey: process.env.SECRET as string
        })
    }

    public static sign({ sub, exp, secretKey }: SignInput): string {
        const token = Jwt.sign({
            sub,
            exp: exp ?? JWT.defaultExpiry()
        }, secretKey)
        return token
    }
}
