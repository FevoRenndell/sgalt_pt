// src/routes/userRoutes.js
import express from 'express';

import {
  addUser,
  modifyUser,
  removeUser,
  fetchUsers,
  fetchUserById,
} from '../controllers/userController.js';

import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
  userQuerySchema,
} from '../validations/userValidations.js';

import {
  validateData,
  validateParams,
  validateQuery,
} from '../middlewares/validateData.js';

const router = express.Router();

// GET /sgal_pt/users/all?...
router.get('/all', validateQuery(userQuerySchema), fetchUsers);

// GET /sgal_pt/users/:id
router.get('/:id', validateParams(userIdParamsSchema), fetchUserById);

// POST /sgal_pt/users/create
router.post('/create', validateData(createUserSchema), addUser);

// PUT /sgal_pt/users/update/:id
router.put(
  '/update/:id',
  validateParams(userIdParamsSchema),
  validateData(updateUserSchema),
  modifyUser
);

// DELETE /sgal_pt/users/delete/:id
router.delete(
  '/delete/:id',
  validateParams(userIdParamsSchema),
  removeUser
);

export default router;
