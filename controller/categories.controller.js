import { getAllCategories, createCategory } from '../service/categories.service.js';

export const getAllCategoriesController = (req, res) => {
    getAllCategories()
        .then((categories) => res.status(200).json(categories))
        .catch((err) => res.status(500).json({ error: err.message }));
};

export const createCategoryController = (req, res) => {
    const category = req.body;
    createCategory(category)
        .then((newCategory) => res.status(201).json(newCategory))
        .catch((err) => res.status(500).json({ error: err.message }));
};