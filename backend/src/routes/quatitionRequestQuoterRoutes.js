// src/routes/quotationRequestQuoterRoutes.js
import express from 'express';

import {
  fetchQuotationRequests,
  fetchQuotationRequestsById,
  createQuotationByQuoter,
  updateQuotationByQuoter,
  removeQuotationByQuoter
} from '../controllers/quoatationRequestQuoterController.js';

import {
  quotationRequestCreateSchema,
  quotationRequestUpdateSchema,
  quotationRequestIdParamsSchema,
  quotationRequestQuerySchema,
} from '../validations/quotationRequestValidation.js';

import {
  validateData,
  validateParams,
  validateQuery,
} from '../middlewares/validateData.js';

const router = express.Router();

router.get('/all', validateQuery(quotationRequestQuerySchema), fetchQuotationRequests);

router.get('/:id',
  validateParams(quotationRequestIdParamsSchema),
  fetchQuotationRequestsById
);

router.post('/create',
  validateData(quotationRequestCreateSchema),
  createQuotationByQuoter
);

router.put('/update/:id',
  validateParams(quotationRequestIdParamsSchema),
  validateData(quotationRequestUpdateSchema),
  updateQuotationByQuoter
);

router.delete('/delete/:id',
  validateParams(quotationRequestIdParamsSchema),
  removeQuotationByQuoter
);

export default router;
