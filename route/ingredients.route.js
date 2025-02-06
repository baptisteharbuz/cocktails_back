import express from 'express';
import { getAllIngredientsController, createIngredientController } from '../controller/ingredients.controller.js';

const router = express.Router();

router.get('/', getAllIngredientsController);
router.post('/', createIngredientController);

export default router;