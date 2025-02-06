import { createUser, login } from '../service/user.service.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createUserController = (req, res) => {
    const user = req.body;
    createUser(user)
        .then(() => {
            res.status(201).send('User created successfully');
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

export const loginController = (req, res) => {
    const { email, mot_de_passe } = req.body;

    login(email, mot_de_passe)
        .then(user => {
            if (user) {

                try {
                    const token = jwt.sign(
                        { id: user.id },
                        process.env.SECRET_KEY,
                        { expiresIn: '24h' }
                    );

                    res.status(200).json({ token, user });
                } catch (err) {
                    res.status(500).send('Erreur lors de la génération du token');
                }
            } else {
                console.log("Identifiants invalides !");
                res.status(401).send('Invalid credentials');
            }
        })
        .catch(err => {
            res.status(500).send('Erreur interne du serveur');
        });
};