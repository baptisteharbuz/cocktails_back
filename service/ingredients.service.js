import conn from '../config/database.js';

export const getAllIngredients = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM ingredients";
        conn.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const createIngredient = (ingredient) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO ingredients (nom) VALUES (?)";
        conn.query(sql, [ingredient.nom], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, nom: ingredient.nom });
        });
    });
};