import conn from '../config/database.js';

export const getAllCocktails = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM cocktails";
        conn.query(sql, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
};

export const getCocktailId = (id) => {
    return new Promise((resolve, reject) => {
        const cocktailQuery = "SELECT * FROM cocktails WHERE id = ?";
        conn.query(cocktailQuery, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            if (results.length === 0) {
                return resolve(null);
            }
            const cocktail = results[0];

            // Requête pour récupérer les ingrédients et leur quantité
            const ingredientsQuery = `
                SELECT i.id, i.nom, ci.quantite 
                FROM ingredients i
                JOIN cocktail_ingredients ci ON i.id = ci.ingredient_id
                WHERE ci.cocktail_id = ?
            `;
            // Requête pour récupérer les catégories associées
            const categoriesQuery = `
                SELECT c.id, c.nom 
                FROM categories c
                JOIN cocktail_categories cc ON c.id = cc.categorie_id
                WHERE cc.cocktail_id = ?
            `;
            // Requête pour récupérer les étapes de préparation triées par ordre croissant
            const stepsQuery = `
                SELECT id, etape, ordre 
                FROM etapes_preparation 
                WHERE cocktail_id = ?
                ORDER BY ordre ASC
            `;

            // On exécute les trois requêtes en parallèle avec Promise.all
            Promise.all([
                new Promise((resolve2, reject2) => {
                    conn.query(ingredientsQuery, [id], (err, results) => {
                        if (err) return reject2(err);
                        resolve2(results);
                    });
                }),
                new Promise((resolve2, reject2) => {
                    conn.query(categoriesQuery, [id], (err, results) => {
                        if (err) return reject2(err);
                        resolve2(results);
                    });
                }),
                new Promise((resolve2, reject2) => {
                    conn.query(stepsQuery, [id], (err, results) => {
                        if (err) return reject2(err);
                        resolve2(results);
                    });
                })
            ])
                .then(([ingredients, categories, etapes]) => {
                    cocktail.ingredients = ingredients;
                    cocktail.categories = categories;
                    cocktail.etapes = etapes;
                    resolve(cocktail);
                })
                .catch(error => {
                    reject(error);
                });
        });
    });
};

export const updateCocktail = (id, cocktailData) => {
    return new Promise((resolve, reject) => {
        conn.beginTransaction((err) => {
            if (err) return reject(err);

            // 1. Mise à jour de la table cocktails
            const updateCocktailSql = `
          UPDATE cocktails 
          SET nom = ?, description = ?, verre = ?, garniture = ?, alcoolise = ?, image = ?
          WHERE id = ?
        `;
            conn.query(
                updateCocktailSql,
                [
                    cocktailData.nom,
                    cocktailData.description,
                    cocktailData.verre,
                    cocktailData.garniture,
                    cocktailData.alcoolise,
                    cocktailData.image,
                    id,
                ],
                (err, result) => {
                    if (err) {
                        return conn.rollback(() => reject(err));
                    }
                    // 2. Mise à jour des ingrédients
                    const deleteIngredientsSql = "DELETE FROM cocktail_ingredients WHERE cocktail_id = ?";
                    conn.query(deleteIngredientsSql, [id], (err, result) => {
                        if (err) {
                            return conn.rollback(() => reject(err));
                        }
                        if (cocktailData.ingredients && cocktailData.ingredients.length > 0) {
                            const insertIngredientsSql = "INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, quantite) VALUES ?";
                            const ingredientValues = cocktailData.ingredients.map((ing) => [
                                id,
                                ing.ingredient_id,
                                ing.quantite,
                            ]);
                            conn.query(insertIngredientsSql, [ingredientValues], (err, result) => {
                                if (err) {
                                    return conn.rollback(() => reject(err));
                                }
                                updateCategories();
                            });
                        } else {
                            updateCategories();
                        }
                    });

                    // Fonction pour mettre à jour les catégories
                    function updateCategories() {
                        const deleteCategoriesSql = "DELETE FROM cocktail_categories WHERE cocktail_id = ?";
                        conn.query(deleteCategoriesSql, [id], (err, result) => {
                            if (err) {
                                return conn.rollback(() => reject(err));
                            }
                            if (cocktailData.categories && cocktailData.categories.length > 0) {
                                const insertCategoriesSql = "INSERT INTO cocktail_categories (cocktail_id, categorie_id) VALUES ?";
                                // cocktailData.categories doit être un tableau d'identifiants de catégorie
                                const categoryValues = cocktailData.categories.map((catId) => [id, catId]);
                                conn.query(insertCategoriesSql, [categoryValues], (err, result) => {
                                    if (err) {
                                        return conn.rollback(() => reject(err));
                                    }
                                    commitTransaction();
                                });
                            } else {
                                commitTransaction();
                            }
                        });
                    }

                    function commitTransaction() {
                        conn.commit((err) => {
                            if (err) {
                                return conn.rollback(() => reject(err));
                            }
                            resolve({ message: "Cocktail updated successfully" });
                        });
                    }
                }
            );
        });
    });
};

export const createCocktail = (cocktailData) => {
    return new Promise((resolve, reject) => {
        conn.beginTransaction((err) => {
            if (err) return reject(err);

            // 1. Insertion dans la table cocktails
            const insertCocktailSql = `
          INSERT INTO cocktails (nom, description, verre, garniture, alcoolise, image)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
            conn.query(
                insertCocktailSql,
                [
                    cocktailData.nom,
                    cocktailData.description,
                    cocktailData.verre,
                    cocktailData.garniture,
                    cocktailData.alcoolise,
                    cocktailData.image,
                ],
                (err, result) => {
                    if (err) return conn.rollback(() => reject(err));
                    const newCocktailId = result.insertId;

                    // 2. Insertion des ingrédients
                    const insertIngredients = () => {
                        if (cocktailData.ingredients && cocktailData.ingredients.length > 0) {
                            const insertIngredientsSql = `
                  INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id, quantite)
                  VALUES ?
                `;
                            const ingredientValues = cocktailData.ingredients.map((ing) => [
                                newCocktailId,
                                ing.ingredient_id,
                                ing.quantite,
                            ]);
                            conn.query(insertIngredientsSql, [ingredientValues], (err) => {
                                if (err) return conn.rollback(() => reject(err));
                                insertCategories();
                            });
                        } else {
                            insertCategories();
                        }
                    };

                    // 3. Insertion des catégories
                    const insertCategories = () => {
                        if (cocktailData.categories && cocktailData.categories.length > 0) {
                            const insertCategoriesSql = `
                  INSERT INTO cocktail_categories (cocktail_id, categorie_id)
                  VALUES ?
                `;
                            const categoryValues = cocktailData.categories.map((cat) => [newCocktailId, cat]);
                            conn.query(insertCategoriesSql, [categoryValues], (err) => {
                                if (err) return conn.rollback(() => reject(err));
                                commitTransaction();
                            });
                        } else {
                            commitTransaction();
                        }
                    };

                    // 4. Commit de la transaction
                    const commitTransaction = () => {
                        conn.commit((err) => {
                            if (err) return conn.rollback(() => reject(err));
                            resolve({ cocktailId: newCocktailId, message: "Cocktail created successfully" });
                        });
                    };

                    insertIngredients();
                }
            );
        });
    });
};
