import { getAllIngredients, createIngredient } from '../service/ingredients.service.js';

export const getAllIngredientsController = (req, res) => {
    getAllIngredients()
        .then((ingredients) => res.status(200).json(ingredients))
        .catch((err) => res.status(500).json({ error: err.message }));
};

export const createIngredientController = (req, res) => {
    const ingredient = req.body;
    createIngredient(ingredient)
        .then((newIngredient) => res.status(201).json(newIngredient))
        .catch((err) => res.status(500).json({ error: err.message }));
};