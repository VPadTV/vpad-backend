import { SimpleUserMapper } from "./user";

export class CommentMapper {
    static readonly selector = {
        id: true,
        text: true,
        user: { select: SimpleUserMapper.selector },
        createdAt: true,
        updatedAt: true,
        _count: {
            select: { children: true }
        }
    }
}
