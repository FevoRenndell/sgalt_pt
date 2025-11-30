import express from 'express';

import {
    fetchUsersFilters,
    fetchRolesFilters,
    fetchQuotationFilters
} from '../controllers/filterController.js';

const router = express.Router();

router.get('/users', fetchUsersFilters);
router.get('/roles', fetchRolesFilters);
router.get('/quotation', fetchQuotationFilters);

 

export default router;
