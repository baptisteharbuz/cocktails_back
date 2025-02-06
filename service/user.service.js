import conn from '../config/database.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createUser = (user) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.mot_de_passe, SALT_ROUNDS, (err, hash) => {
            if (err) {
                return reject(err);
            }

            const sql = "INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)";
            conn.query(sql, [user.nom, user.email, hash], (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    });
};

export const login = (email, mot_de_passe) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM utilisateurs WHERE email = ?";
        
        conn.query(sql, [email], (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.length > 0) {
                const user = results[0];

                bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, isMatch) => {
                    if (err) {
                        return reject(err);
                    }

                    if (isMatch) {
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                });
            } else {
                resolve(null);
            }
        });
    });
};