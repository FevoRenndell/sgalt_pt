import express from 'express';

import {
    getRegionsFilter,
    getCitiesFilter,
    getCommunesFilter,
    createQuotationByClient,
    AcceptQuotationRequestByClient
} from '../controllers/quoatationRuequestController.js';

import { validateBody } from '../middlewares/validateBody.js';
import { quotationRequestCreateSchema } from '../validations/quotationRequestValidation.js';

const router = express.Router();

router.get('/regions', getRegionsFilter);
router.get('/city/:regionId', getCitiesFilter);
router.get('/communes/:cityId', getCommunesFilter);


router.post('/create_quotation', validateBody(quotationRequestCreateSchema), createQuotationByClient);
router.post('/accept_quotation', AcceptQuotationRequestByClient);


export default router;
