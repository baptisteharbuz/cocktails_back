import { getAllCocktails, getCocktailId, updateCocktail, createCocktail } from '../service/cocktail.service.js';

export const getAllCocktailsController = (req, res) => {
    getAllCocktails()
        .then(cocktails => {
            res.status(200).json(cocktails);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

export const getCocktailIdController = (req, res) => {
    const cocktailId = req.params.id;
    getCocktailId(cocktailId)
        .then(cocktail => {
            if (cocktail) {
                res.status(200).json(cocktail);
            } else {
                res.status(404).send('Cocktail not found');
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

export const updateCocktailController = (req, res) => {
    const cocktailId = req.params.id;
    const cocktailData = req.body;
    updateCocktail(cocktailId, cocktailData)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
};

export const createCocktailController = (req, res) => {
    const cocktailData = req.body;
    createCocktail(cocktailData)
        .then((result) => res.status(201).json(result))
        .catch((err) => res.status(500).json({ error: err.message }));
};