import express from 'express';

import {
    getPong
} from '../controllers/testController.js';

const router = express.Router();

// GET /clients/list
router.get('/ping',  getPong);

export default router;


