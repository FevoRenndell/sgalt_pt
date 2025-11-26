import authenticateJWT from '../middlewares/authenticateJWT.js';
import clientRoutes from './clientRoutes.js';
import testRoutes from './testRoutes.js';
import authRoutes from './authRoutes.js';
import filterRoutes from './filterRoutes.js';
import userRoutes from './userRoutes.js';
import quatitionRequestClientRoutes from './quatitionRequestClientRoutes.js';
import quatitionRequestQuoterRoutes from './quatitionRequestQuoterRoutes.js';
import quotationRoutes from './quotationRoutes.js';

import { errorHandler } from '../middlewares/errorHandler.js';

const middlewares = [
  authenticateJWT,
];

const initRoutes = (apiName, app) =>  {

  //ruta publica
  app.use(`/${apiName}/auth`   , authRoutes  );
  app.use(`/${apiName}/quoter` , quatitionRequestClientRoutes  );
  //ruta privadas
  app.use(`/${apiName}/test`   , middlewares, testRoutes  );
  app.use(`/${apiName}/users`  , middlewares, userRoutes  );
  app.use(`/${apiName}/clients`, middlewares, clientRoutes);
  app.use(`/${apiName}/filters`, middlewares, filterRoutes);
  app.use(`/${apiName}/quotation`, middlewares, quotationRoutes);
  app.use(`/${apiName}/quotation_requests`, middlewares, quatitionRequestQuoterRoutes);

  app.use(errorHandler);
};

export default initRoutes;
