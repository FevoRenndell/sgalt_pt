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
} from '../validations/userValidations.js';

import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

router.get('/all', fetchUsers);
router.get('/:id', fetchUserById);
router.post('/create', validateBody(createUserSchema), addUser);
router.put('/update/:id', validateBody(updateUserSchema), modifyUser);
router.delete('/delete/:id', removeUser);

export default router;
