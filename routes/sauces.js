// Importation de plugin externe nécessaire pour utiliser le router d'Express
const express = require("express");
// Importation du routeur avec la méthode mise à disposition par Express
const router = express.Router();

// On importe le middleware auth pour sécuriser les routes
// Récupère la configuration d'authentification
const auth = require("../middleware/auth");
//On importe le middleware multer pour la gestion des images
const multer = require("../middleware/multer-config");

// On associe les fonctions aux différentes routes, on importe le controller
const sauceCtrl = require("../controllers/sauces");


// Route qui permet de créer "une sauce"
router.post("/", auth, multer, sauceCtrl.createSauce);

// Route qui permet de récupérer toutes les sauces
router.get("/", auth, sauceCtrl.getAllSauces);

// Route qui permet de cliquer sur une des sauces précise
router.get("/:id", auth, sauceCtrl.getOneSauce);

// Route qui permet de modifier "une sauce"
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// Route qui permet de supprimer "une sauce"
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// Route qui permet de gérer les likes des sauces
router.post('/:id/like', auth, sauceCtrl.addLikeOrDislike);

module.exports = router;
