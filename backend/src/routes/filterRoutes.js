import express from 'express';

import {
    fetchUsersFilters,
} from '../controllers/filterController.js';

const router = express.Router();

router.get('/users', fetchUsersFilters);
 

export default router;
