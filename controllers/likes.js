//Imporattion de models de la BD
const Sauce = require("../models/sauces");

exports.addLikeOrDislike = (req, res, next) => {
  console.log("Je suis dans la controller like");

  //Affichage du req.body
  console.log("---->CONTENU: req.body.like - ctrl like");
  console.log(req.body.like);

  //récuprere l'id dans l'url de la requête
  console.log("---->CONTENU: req.params - ctrl like");
  console.log(req.params);

  //mise au format de l'id pour chercher l'objet correspondant
  console.log("---->id en _id");
  console.log({ _id: req.params.id });

  //Récuperer objet dans la BD
  Sauce.findOne({ _id: req.params.id })
    .then((objet) => {
      console.log("---->CONTENU: promise : objet");
      console.log(objet);

      // Si usersliked est False et si like === 1
      if (!objet.usersLiked.includes(req.body.userId) && req.body.like === 1) {
        console.log("les instructions seront exécuté");

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
        console.log("--->userId est dans usersLiked et like = 0");

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
    })
    .catch((error) => res.status(404).json({ error }));
};
