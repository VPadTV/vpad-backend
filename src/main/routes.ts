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

export default [
    new UserRoute(),
    new AdminRoute(),
    new DocumentationRoute(),
    new SeriesRoute(),
    new PostRoute(),
    new CommentRoute(),
    new TierRoute(),
    new SubRoute(),
    new VoteRoute(),
    // new PayRoute(),
] as IRoute[]