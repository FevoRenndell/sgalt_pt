import authenticateJWT from '../middlewares/authenticateJWT.js';
import clientRoutes from './clientRoutes.js';
import testRoutes from './testRoutes.js';
import authRoutes from './authRoutes.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const middlewares = [
  authenticateJWT,
];

const initRoutes = (apiName, app) =>  {

  //ruta publica
  app.use(`/${apiName}/auth`  , authRoutes  );

  //ruta privadas
  app.use(`/${apiName}/test`   , middlewares, testRoutes  );
  app.use(`/${apiName}/clients`, middlewares, clientRoutes);


   app.use(errorHandler);
};

export default initRoutes;
