import express from 'express';
import { createUser, getAllUsers, deleteUser, editUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/users/create', createUser);
router.get('/users/list', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id', editUser);

export default router;