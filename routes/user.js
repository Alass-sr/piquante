// Importation express
const express = require("express");

// Importation du middleware/password
const password = require("../middleware/password");

// Importation du middleware/email validator
const emailValidator = require('../middleware/emailValidator');

// Importation du controllers/user
const userCtrl = require("../controllers/user");

// appel de la fonction Router()
const router = express.Router();

// Route "endpoint" signup
router.post("/signup", password, emailValidator, userCtrl.signup);

// Route "endpoint" login
router.post("/login", userCtrl.login);

// Exportation du module
module.exports = router;
