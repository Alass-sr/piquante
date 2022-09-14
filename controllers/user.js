const bcrypt = require("bcrypt");

const User = require("../models/User");

const log = require("../utils/winston");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
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
    User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        log.error(`error incorrect user => ${req.body.email}`);
        return res.status(401).json({error: "Utilisateur non trouvé !"});
      } else {
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
              res.status(401).json({message: 'Paire identif/mot de passe incorrecte'})
            } else {
              res.status(200).json({
                userId: user._id,
                token: 'TOKEN'
              });
            }
        })
        .catch(error => {
          res.status(500).json( { error } );
        })
      }
    })
    .catch(error => {
      res.status(500).json( {error} );
    })

};
