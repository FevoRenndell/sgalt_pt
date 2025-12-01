// src/routes/clientRoutes.js
import express from 'express';

import {
  fetchNotifications,
  readNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/popover/:userID', fetchNotifications);

router.patch('/readed/:notificationId', readNotification);

export default router;
