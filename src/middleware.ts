import withOriginMiddleware from './middlewares/withOrigin';
import { stackMiddlewares } from './middlewares/stackMiddlewares';
import withLocaleMiddleware from './middlewares/withLocale';

const middlewares = [
  withOriginMiddleware,
  withLocaleMiddleware,
];

// export const middleware = (req: NextRequest) => {
//   const res = checkOriginMiddleware(req);
//   return res;
// };

// export const config = {
//   matcher: '/api/:path*',
// };

export default stackMiddlewares(middlewares);
