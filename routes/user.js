// Importation express
const express = require("express");

// Importation du middleware/password
const password = require("../middleware/password");

// Importation du controllers/user
const userCtrl = require("../controllers/user");

// appel de la fonction Router()
const router = express.Router();

// Route "endpoint" signup
router.post("/signup", password, userCtrl.signup);

// Route "endpoint" login
router.post("/login", userCtrl.login);

// Exportation du module
module.exports = router;
