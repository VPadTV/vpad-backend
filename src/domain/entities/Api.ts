import { EPostDeleteStatus } from '@infrastructure/repositories/post/constants';
import { FileRawUpload } from '@middlewares/files.types';
import { SmartStream } from '@plugins/storage';
import { SimpleUser } from '@plugins/user';
import { User } from '@prisma/client';

export interface Paginate<T> {
	total: number;
	to: number;
	from: number;
	currentPage: number;
	lastPage: number;
	data: T[];
}
export interface AdminManageBan {
	id: string;
	banned: boolean;
	banTimeout?: string;
}
export interface AdminManageBanRequest extends AdminManageBan {}
export interface AdminManageBanResponse extends AdminManageBan {}
export interface AdminManage {
	id: string;
	admin: boolean;
}
export interface AdminManageResponse extends AdminManage {}
export interface AdminManageRequest extends AdminManage {
	user: User;
}
export interface AdminGetManyRequest {}
export interface AdminGetManyResponse {
	users: SimpleUser[];
}

export interface CommentMeta {
	user: SimpleUser;
	createdAt: string;
	updatedAt: string;
}

export interface CommentActionsProps {
	user: User;
	id: string;
}

export interface CommentEditRequest extends CommentActionsProps {
	text: string;
}

export interface CommentDeleteRequest extends CommentActionsProps {}

export interface CommentCreateRequest extends Partial<CommentEditRequest> {
	postId: string;
	parentId?: string;
}

export interface CommentCreateResponse extends Partial<CommentCreateRequest> {}
export interface CommentDeleteResponse {}
export interface CommentEditResponse extends CommentEditRequest {
	updatedAt: Date;
}

export interface CommentGetRequest extends CommentActionsProps {}

export interface CommentGetResponse extends Partial<CommentEditRequest> {
	childrenCount: number;
	meta: CommentMeta;
}

export interface CommentGetManyRequest extends Partial<CommentCreateRequest> {
	sortBy: 'latest' | 'oldest';
	page: number;
	size: number;
}

export interface CommentGetManyResponse extends Paginate<CommentGetResponse> {}

export interface PostCreateRequest {
	user: User;
	otherAuthorIds?: string[];
	title: string;
	text: string;
	media: FileRawUpload;
	thumb?: FileRawUpload;
	nsfw: boolean;
	tags: string;
	minTierId?: string;
}

export interface PostCreateResponse {
	id: string;
}

export interface PostDeleteRequest extends CommentActionsProps {}

export interface PostDeleteResponse {
	status: EPostDeleteStatus;
}

export interface PostEditRequest extends PostCreateRequest {}

export interface PostEditResponse {}

export interface PostGetRequest extends Partial<CommentActionsProps> {}

export interface PostMeta {
	nsfw: boolean;
	tags: string[];
	minTier?: {
		id: string;
		name: string;
		price: number;
	};
	authors: SimpleUser[];
	likes: number;
	dislikes: number;
	views: number;
	myVote: number;
	createdAt: string;
	updatedAt: string;
}

export interface PostGetResponse {
	title: string;
	text: string;
	mediaType: string;
	mediaUrl: string;
	thumbUrl?: string;
	meta: PostMeta;
}

export interface PostGetManyResponse extends Paginate<PostGetResponse> {}

export interface PostGetManyRequest {
	user?: User;
	userTierId?: string;
	creatorId?: string;
	sortBy: 'latest' | 'oldest' | 'high-views' | 'low-views';
	titleSearch?: string;
	nsfw?: boolean;
	page: number;
	size: number;
}

export type createdAtSort = { createdAt: 'desc' | 'asc' };
export type votesSort = { votes: { _count: 'desc' | 'asc' } };

export type PostSort = createdAtSort | votesSort;

export interface PostStreamRequest {
	key: string;
	width?: string;
}

export interface PostStreamResponse {
	stream: SmartStream;
	ContentLength: number;
	ContentType: string;
}

export interface SubCreateRequest {
	user: User;
	creatorId: string;
	tierId: string;
}

export interface SubCreateResponse {}

export interface SubDeleteRequest {
	user: User;
	id: string;
}

export interface SubDeleteResponse {}

export interface SubGetRequest {
	user: User;
	creatorId: string;
}

export interface SubGetResponse {
	id?: string;
	tier?: {
		id: string;
		name: string;
	};
}

export interface SubUpdateRequest {
	user: User;
	id: string;
	tierId: string;
}

export interface SubUpdateResponse {}

export interface TierCreateRequest {
	user: User;
	name: string;
	price: string;
}

export interface TierCreateResponse {
	id: string;
}

export interface TierDeleteRequest {
	user: User;
	id: string;
}

export interface TierDeleteResponse {}

export interface TierGetManyRequest {
	creatorId: string;
}

export interface TierGetManyResponse {
	tiers: {
		name: string;
		price: number;
	}[];
}

export interface TierUpdateRequest {
	user: User;
	id: string;
	name: string;
}

export interface TierUpdateResponse {}

export interface UserEditRequest {
	id: string;
	username?: string;
	nickname?: string;
	email?: string;
	password?: string;
	about?: string;
	profilePhoto?: FileRawUpload;
}

export interface UserEditResponse {}

export interface UserGetRequest {
	id: string;
}

export interface UserGetResponse {
	username: string;
	nickname: string;
	email: string;
	profilePhotoUrl: string | null;
	about: string | null;
	contact: string | null;
	admin: boolean;
}

export interface UserGetManyRequest {
	usernameSearch?: string;
	nicknameSearch?: string;
	banned?: boolean;
}

export interface UserGetManyResponse {
	users: SimpleUser[];
}

export interface UserIsBannedRequest {
	user: User;
}

export interface UserIsBannedResponse {
	banned: boolean;
}

export interface UserLoginRequest {
	emailOrUsername: string;
	password: string;
}

export interface UserLoginResponse {
	id: string;
	token: string;
}

export interface UserRegisterRequest {
	username: string;
	nickname?: string;
	email: string;
	password: string;
	about?: string;
}

export interface UserRegisterResponse {
	id: string;
	token: string;
}

export interface VoteSetRequest {
	user: User;
	postId: string;
	vote: number;
}

export interface VoteSetResponse {}
