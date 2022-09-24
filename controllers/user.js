// Importation de l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const bcrypt = require("bcrypt");

// Importation du package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const jwt = require("jsonwebtoken");

// Importation du package crypto-js pour le cryptage du email
const cryptojs = require("crypto-js");

// Importation du module "dotenv" pour masquer les informations de connexion à la base de données
const dotenv = require("dotenv").config();

// On récupère notre model User ,créer avec le schéma mongoose
const User = require("../models/user");

const log = require("../utils/winston");

exports.signup = (req, res, next) => {
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_KEY}`)
    .toString();
  // console.log("--->CONTENU: emailCryptoJs");
  // console.log(emailCryptoJs);

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => {
          log.info(`signup save ok for ${req.body.email}`);
          res.status(201).json({ message: "Utilisateur créé" });
        })
        .catch((error) => {
          log.error(`error save signup ${error}`);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      log.error(`global error signup ${error}`);
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  const emailCryptoJs = cryptojs
    .HmacSHA256(req.body.email, `${process.env.CRYPTOJS_KEY}`)
    .toString();
  // console.log("--->CONTENU: emailCryptoJs");
  // console.log(emailCryptoJs);
  
  // On doit trouver l'utilisateur dans la BDD qui correspond à l'adresse entrée par l'utilisateur
  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (!user) {
        log.error(`error incorrect user => ${req.body.email}`);
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      // On utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Si false, c'est que ce n'est pas le bon utilisateur, ou le mot de passe est incorrect
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          // Si true, on renvoie un statut 200 et un objet JSON avec un userID + un token
          res.status(200).json({ // Le serveur backend renvoie un token au frontend
            userId: user._id,
            // Permet de vérifier si la requête est authentifiée
            token: jwt.sign(
              { userId: user._id }, 
              
              // Clé d'encodage du token
              `${process.env.SECRET_TOKEN}`,

              { expiresIn: "24h" }
              )
              // On encode le userID pour la création de nouveaux objets, et cela permet d'appliquer le bon userID
            // aux objets et ne pas modifier les objets des autres
          });
        })
        .catch(error => {
                    log.error(`error for brypt compare ${error}`);
                    res.status(500).json({ error })
                });
    })
    .catch(error => {
      log.error(`global error for login = ${error}`);
      res.status(500).json({ error })
  }
  );
};
