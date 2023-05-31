import withOriginMiddleware from './middlewares/withOrigin';
import { stackMiddlewares } from './middlewares/stackMiddlewares';
import withLocaleMiddleware from './middlewares/withLocale';
import withTokenMiddleware from './middlewares/withToken';

const middlewares = [
  withOriginMiddleware,
  withLocaleMiddleware,
  withTokenMiddleware,
];

export default stackMiddlewares(middlewares);
