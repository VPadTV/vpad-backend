export class SimpleUserMapper {
    constructor(
        readonly id: string,
        readonly nickname: string,
        readonly profilePhotoUrl: string | null,
    ) { }

    static readonly selector = {
        id: true,
        nickname: true,
        profilePhotoUrl: true,
    }

    static fromAny(user: any) {
        return new SimpleUserMapper(
            user.id,
            user.nickname,
            user.profilePhotoUrl
        )
    }
}