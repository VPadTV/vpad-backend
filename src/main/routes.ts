import { IRoute } from '@main/route';
import { UserRoute } from '../routes/user';
import { AdminRoute } from '@controllers/admin';
import { DocumentationRoute } from '@controllers/documentation';
import { PostRoute } from '@controllers/post';
import { CommentRoute } from '@controllers/comment';
import { TierRoute } from '@controllers/tier';
import { SubRoute } from '@controllers/sub';
import { VoteRoute } from '@controllers/vote';
import { SeriesRoute } from '@controllers/series';
// import { PayRoute } from '@controllers/pay';

export default {
    '/user': new UserRoute(),
    '/admin': new AdminRoute(),
    '/docs': new DocumentationRoute(),
    '/series': new SeriesRoute(),
    '/post': new PostRoute(),
    '/comment': new CommentRoute(),
    '/tier': new TierRoute(),
    '/sub': new SubRoute(),
    '/vote': new VoteRoute(),
    // '/pay': new PayRoute(),
} as { [path: string]: IRoute }