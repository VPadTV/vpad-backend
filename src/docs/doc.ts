import { userRegister } from './paths/user/register';
import { userId } from './paths/user/id';
import { userLogin } from './paths/user/login';
import { postId } from './paths/post/id';
import { postNoId } from './paths/post/noId';
import { commentId } from './paths/comment/id';
import { commentNoId } from './paths/comment/noId';
import { adminNoId } from './paths/admin/noId';
import { adminId } from './paths/admin/manage/adminId';
import { adminBanId } from './paths/admin/manage/banId';
import { postStreamKey } from './paths/post/streamKey';
import { subNoId } from './paths/sub/noId';
import { subId } from './paths/sub/id';
import { tierNoId } from './paths/tier/noId';
import { tierId } from './paths/tier/id';
import { tierCreatorId } from './paths/tier/creatorId';
import { subCreatorId } from './paths/sub/creatorId';
import { votePostId } from './paths/vote/postId';
import { commId } from './paths/commission/id';
import { commNoId } from './paths/commission/noId';
import { seriesId } from './paths/series/id';
import { seriesNoId } from './paths/series/noId';
import { seriesOwnerId } from './paths/series/ownerId';
import { userNoId } from './paths/user/noId';
import { userWhoAmI } from './paths/user/whoami';

export default {
    openapi: '3.0.0',
    info: {
        title: 'VPAD API',
        version: '0.0.1',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server',
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
        },
    },
    paths: {
        '/user': userNoId,
        '/user/{id}': userId,
        '/user/login': userLogin,
        '/user/register': userRegister,
        '/user/whoami': userWhoAmI,

        '/tier': tierNoId,
        '/tier/{id}': tierId,
        '/tier/creator/{creatorId}': tierCreatorId,

        '/sub': subNoId,
        '/sub/{id}': subId,
        '/sub/{creatorId}': subCreatorId,

        '/series/{id}': seriesId,
        '/series/{ownerId}': seriesOwnerId,
        '/series': seriesNoId,

        '/post/{id}': postId,
        '/post/stream/{key}': postStreamKey,
        '/post': postNoId,

        '/vote/{postId}': votePostId,

        '/comment/{id}': commentId,
        '/comment': commentNoId,

        '/commission/{id}': commId,
        '/commission': commNoId,

        '/admin': adminNoId,
        '/admin/manage/admin/{id}': adminId,
        '/admin/manage/ban/{id}': adminBanId,

        // '/pay/donate': donate,
    }
}