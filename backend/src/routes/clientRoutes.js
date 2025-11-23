// src/routes/clientRoutes.js
import express from 'express';

import {
  fetchClients,
  fetchClientById,
  fetchClientByRut,
  addClient,
  modifyClient,
  removeClient,
} from '../controllers/clientController.js';

import {
  clientQuerySchema,
  createClientSchema,
  updateClientSchema,
  clientIdParamsSchema,
} from '../validations/clientValidations.js';

import {
  validateData,
  validateParams,
  validateQuery,
} from '../middlewares/validateData.js';

const router = express.Router();

// GET /sgal_pt/clients/all?...
router.get('/all', validateQuery(clientQuerySchema), fetchClients);

// GET /sgal_pt/clients/:id
router.get('/:id', validateParams(clientIdParamsSchema), fetchClientById);

// POST /sgal_pt/clients/create
router.post('/create', validateData(createClientSchema), addClient);

// PUT /sgal_pt/clients/update/:id
router.put(
  '/update/:id',
  validateParams(clientIdParamsSchema),
  validateData(updateClientSchema),
  modifyClient
);

// DELETE /sgal_pt/clients/delete/:id
router.delete(
  '/delete/:id',
  validateParams(clientIdParamsSchema),
  removeClient
);

export default router;
