import express from 'express';
import userRoute from './user.route.js';
import cocktailRoute from './cocktail.route.js';
import ingredientsRoute from './ingredients.route.js';
import categoriesRoute from './categories.route.js';
import auth from '../middleware/authentification.js';

const router = express.Router();

router.use('/user', userRoute);
router.use('/cocktail', auth, cocktailRoute);
router.use('/ingredients', auth, ingredientsRoute);
router.use('/categories', auth, categoriesRoute);

export default router;