import { UserHttpReq } from '@plugins/requestBody'
import { UserGetResponse } from './get'

export type UserWhoAmIRequest = {}

export async function userWhoAmI(req: UserHttpReq<UserWhoAmIRequest>): Promise<UserGetResponse> {
    const user = req.user
    return {
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        profilePhotoUrl: user.profilePhotoUrl ?? null,
        about: user.about ?? null,
        contact: user.contact ?? null,
        admin: user.admin
    }
}
