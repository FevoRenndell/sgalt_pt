import express from 'express';

import {
    getAllClients
} from '../controllers/clientController.js';

const router = express.Router();

// GET /clients/list
router.get('/list',  getAllClients);

export default router;


