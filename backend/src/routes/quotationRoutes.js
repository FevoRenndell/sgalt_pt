// src/routes/quotationRoutes.js
import express from 'express';

import {
  addQuotation,
  modifyQuotation,
  removeQuotation,
  fetchQuotations,
  fetchQuotationById,
  senderEmailQuotation
} from '../controllers/quotationController.js';

import {
  quotationCreateSchema,
} from '../validations/quotationValidations.js';


import {
  validateData,
  validateParams,
  validateQuery,
} from '../middlewares/validateData.js';

const router = express.Router();

router.get('/all',  fetchQuotations);
router.get('/:id',  fetchQuotationById);
router.post('/create', validateData(quotationCreateSchema), addQuotation);
router.post('/send_email',  senderEmailQuotation);

/*
import {
  createQuotationSchema,
  updateQuotationSchema,
  quotationIdParamsSchema,
  quotationQuerySchema,
} from '../validations/quotationValidations.js';
/*





// GET /sgal_pt/users/all?...


// GET /sgal_pt/users/:id


// POST /sgal_pt/users/create
/*

// PUT /sgal_pt/users/update/:id
router.put(
  '/update/:id',
  validateParams(quotationIdParamsSchema),
  validateData(updateQuotationSchema),
  modifyQuotation
);

// DELETE /sgal_pt/users/delete/:id
router.delete(
  '/delete/:id',
  validateParams(quotationIdParamsSchema),
  removeQuotation
);*/


export default router;
