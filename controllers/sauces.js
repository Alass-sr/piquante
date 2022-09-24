// Récupération du modèle 'sauces'
const Sauce = require("../models/sauces");

// Récupération du module 'file system' de Node permettant de gérer ici les téléchargements et modifications d'images
const fs = require("fs");

// Importation de winston pour les log
const log = require("../utils/winston");

exports.createSauce = (req, res, next) => {
  log.info("createSauce");
  log.info(`createSauce req body = ${JSON.stringify(req.body)}`);
  // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
  const sauceObject = JSON.parse(req.body.sauce);

  // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
  delete sauceObject._id;
  // delete sauceObject._userId;
   // Création d'une instance du modèle Sauce
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
   // On modifie l'URL de l'image 
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // Sauvegarde de la sauce dans la base de données
  sauce
    .save()
    // On envoi une réponse au frontend avec un statut 201
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    // On ajoute un code erreur en cas de problème
    .catch(error => {
      res.status(400).json({ error })
    })
};

exports.getAllSauces = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
  Sauce.find()
  // Si OK on retourne un tableau de toutes les données
    .then((sauces) => res.status(200).json(sauces))
    // Si erreur on retourne un message d'erreur
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({ _id: req.params.id })
  // Si ok on retourne une réponse et l'objet
    .then((sauce) => res.status(200).json(sauce))
    // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  log.info("modifySauce");
  log.info(`modifySauce req body = ${JSON.stringify(req.body)}`);

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.statuts(401).json({ message: "Non autorisé" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Pour extraire ce fichier, on récupère l'url de la sauce
        const filename = sauce.imageUrl.split("/images/")[1];
        // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
        fs.unlink(`images/${filename}`, () => {
           // On supprime le document correspondant de la base de données
          sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};


exports.addLikeOrDislike = (req, res, next) => {
  //Récuperer objet dans la BD
  Sauce.findOne({ _id: req.params.id })
    .then((objet) => {
      // console.log("---->CONTENU: promise : objet");
      // console.log(objet);

      // Si usersliked est False et si like === 1
      if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        //Mis à jour BDD
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like +1" }))
          .catch((error) => res.status(400).json({ error }));
      }

      if (objet.usersLiked.includes(req.body.userId) && req.body.like === 0) {
        //Mis à jour BDD
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like 0" }))
          .catch((error) => res.status(400).json({ error }));
      }

      if (
        !objet.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        //Mis à jour BDD
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: 1 },
            $push: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce dislike +1" }))
          .catch((error) => res.status(400).json({ error }));
      }

      // Après un like = -1 on met un like = 0
      if (
        objet.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        //Mis à jour BDD
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: req.body.userId },
          }
        )
          .then(() => res.status(201).json({ message: "Sauce like 0" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};
