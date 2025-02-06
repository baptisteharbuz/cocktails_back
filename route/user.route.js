import express from 'express';
const router = express.Router();
import { createUserController, loginController } from '../controller/user.controller.js';

router.post('/register', createUserController);
router.post('/login', loginController);

export default router;