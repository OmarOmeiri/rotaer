import withOriginMiddleware from './middlewares/withOrigin';
import { stackMiddlewares } from './middlewares/stackMiddlewares';
import withLocaleMiddleware from './middlewares/withLocale';
import withAuthMiddleware from './middlewares/withAuth';

const middlewares = [
  withOriginMiddleware,
  withLocaleMiddleware,
  withAuthMiddleware,
];

export default stackMiddlewares(middlewares);
