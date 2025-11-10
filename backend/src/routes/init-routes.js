import authenticateJWT from '../middlewares/authenticateJWT.js';
import clientRoutes from './clientRoutes.js';
import testRoutes from './testRoutes.js';
import authRoutes from './authRoutes.js';
import { errorHandler } from '../middlewares/errorHandler.js';

const middlewares = [
  authenticateJWT,
];

const initRoutes = (app) =>  {

  //ruta publica
  app.use('/auth'  , authRoutes  );

  //ruta privadas
  app.use('/test'   , middlewares, testRoutes  );
  app.use('/clients', middlewares, clientRoutes);


   app.use(errorHandler);
};

export default initRoutes;
