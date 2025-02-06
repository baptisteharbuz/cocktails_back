import express from 'express';
import { getAllCategoriesController, createCategoryController } from '../controller/categories.controller.js';

const router = express.Router();

router.get('/', getAllCategoriesController);
router.post('/', createCategoryController);

export default router;