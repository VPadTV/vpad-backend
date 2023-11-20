import Jwt, { Secret } from 'jsonwebtoken'

export type SignInput = {
  sub: string
  exp?: number
  secretKey: Secret
}

export interface IJwtGateway {
  decode(token: string): Jwt.JwtPayload
  sign(params: SignInput): string
}

export type JWTClient = typeof Jwt

export class JwtGateway implements IJwtGateway {
  private client: JWTClient
  constructor() {
    this.client = Jwt
  }

  private static defaultExpiry() {
    return Date.now() + 7*24*60*60*1000 // 7 days in milliseconds
  }

  public decode(token: string): Jwt.JwtPayload {
    const decoded = this.client.decode(token) as Jwt.JwtPayload
    return decoded
  }

  public sign({ sub, exp, secretKey }: SignInput): string {
    const token = this.client.sign({
      sub,
      exp: exp ?? JwtGateway.defaultExpiry()
    }, secretKey)
    return token
  }
}
