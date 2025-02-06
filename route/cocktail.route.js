import express from 'express';
import {
  getAllCocktailsController,
  getCocktailIdController,
  updateCocktailController,
  createCocktailController,
} from '../controller/cocktail.controller.js';

const router = express.Router();

router.get('/all', getAllCocktailsController);
router.post('/', createCocktailController);
router.put('/:id', updateCocktailController);
router.get('/:id', getCocktailIdController);

export default router;