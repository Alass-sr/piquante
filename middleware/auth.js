// On récupère le package jsonwebtoken
const jwt = require('jsonwebtoken');
const log = require("../utils/winston");

// Importation du module "dotenv" pour masquer les informations de connexion à la base de données
const dotenv = require("dotenv").config();

// Ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
    try {
        log.info(`auth`);
        // On récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
        const token = req.headers.authorization.split(' ')[1];
        log.info(token);
        // On vérifie le token décodé avec la clé secrète initiéé avec la création du token encodé initialement (Cf Controller user), les clés doivent correspondre
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        log.info(decodedToken);
        // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valide';
        } else {
        // si tout est valide on passe au prochain middleware    
            next();
        }
    } catch(error) {
        log.error(error);
        res.status(401).json({ error });
    }
};