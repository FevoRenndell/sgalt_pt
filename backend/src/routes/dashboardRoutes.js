// src/routes/clientRoutes.js
import express from 'express';

import {
   dashboard
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dash1', dashboard);

export default router;
