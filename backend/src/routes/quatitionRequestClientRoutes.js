// src/routes/quotationRequestClientRoutes.js
import express from 'express';

import {
    getCitiesFilter,
    getRegionsFilter,
    getCommunesFilter,
    createQuotationByClient,
    AcceptQuotationRequestByClient,
} from '../controllers/quoatationRequestClientController.js';

import {


    cityIdParamsSchema,
    regionIdParamsSchema,
    quotationRequestAcceptSchema,
    quotationRequestCreateSchema,
} from '../validations/quotationRequestValidation.js';

import {
    validateData,
    validateParams,
} from '../middlewares/validateData.js';
import { clientRutParamsSchema } from '../validations/clientValidations.js';
import { fetchClientByRut } from '../controllers/clientController.js';

const router = express.Router();


router.get('/regions', getRegionsFilter);

router.get(
    '/city/:regionId',
    validateParams(regionIdParamsSchema),
    getCitiesFilter
);

router.get(
    '/communes/:cityId',
    validateParams(cityIdParamsSchema),
    getCommunesFilter
);

// Crear solicitud de cotización por cliente
router.post(
  '/create_quotation',
  validateData(quotationRequestCreateSchema),
  createQuotationByClient
);

// Aceptar cotización por cliente
router.post(
    '/accept_quotation',
    validateData(quotationRequestAcceptSchema),
    AcceptQuotationRequestByClient
);

// GET /sgal_pt/clients/:rut
router.get('/rut/:rut', validateParams(clientRutParamsSchema), fetchClientByRut);

export default router;
