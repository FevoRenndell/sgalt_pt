import express from 'express';

import {
    fetchUsersFilters,
    fetchQuotationFilters
} from '../controllers/filterController.js';

const router = express.Router();

router.get('/users', fetchUsersFilters);
router.get('/quotation', fetchQuotationFilters);
 

export default router;
