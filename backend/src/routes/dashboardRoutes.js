// src/routes/clientRoutes.js
import express from 'express';

import {
   
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/popover/:userID', fetchNotifications);

 

export default router;
