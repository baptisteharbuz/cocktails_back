import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decryptedToken = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
        req.user = decryptedToken;
        next();
    } catch (error) {
        console.error("Erreur de vérification du token :", error);
        return res.status(403).json({ message: 'Token invalide' });
    }
};