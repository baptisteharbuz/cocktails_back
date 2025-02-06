import conn from '../config/database.js';

export const getAllCategories = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM categories";
        conn.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const createCategory = (category) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO categories (nom) VALUES (?)";
        conn.query(sql, [category.nom], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.insertId, nom: category.nom });
        });
    });
};