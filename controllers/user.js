const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

const dotenv = require("dotenv").config();
// const result = dotenv.config();

const User = require("../models/User");

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

  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (!user) {
        log.error(`error incorrect user => ${req.body.email}`);
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id }, 
              
              `${process.env.SECRET_TOKEN}`,

              { expiresIn: "24h" }
              ),
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
