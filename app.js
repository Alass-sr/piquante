// Importation d'Express
const express = require("express");

// Importation de body parser permet d'extraire l'objet JSON des rêquetes POST
const bodyParser = require("body-parser");

// Importation de mongoose pour pouvoir utiliser la Base de Donnée
// Plugin mongoose pour se connecter à la data base MongoDB
const mongoose = require("mongoose");

// Importation du module "dotenv" pour masquer les informations de connexion à la base de données
const dotenv = require("dotenv").config();

// Déclaration des routes
// On importe la route dédiée aux sauces
const sauceRoutes = require("./routes/sauces");
// On importe la route dédiée aux utilisateurs
const userRoutes = require("./routes/user");

// On donne accès au chemin de notre système de fichier
const path = require("path");

// // utilisation du module 'helmet' pour la sécurité en protégeant l'application de certaines vulnérabilités
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// Importation de mongoose avec le fichier .env cache le mot de passe
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création de l'appli express
const app = express();

// On utilise helmet pour plusieurs raisons notamment la mise en place du X-XSS-Protection afin d'activer le filtre de script intersites(XSS) dans les navigateurs web
app.use(helmet());

app.use(express.json());

// Middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
  // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
  res.setHeader("Access-Control-Allow-Origin", "*");
  // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // on indique les méthodes autorisées pour les requêtes HTTP
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  next();
});

// Transforme les données arrivant de la requête POST en un objet JSON facilement exploitable
app.use(bodyParser.json());

app.use(mongoSanitize());

// Va servir les routes dédiées aux sauces
app.use("/api/sauces", sauceRoutes);

// Va servir les routes dédiées aux utilisateurs
app.use("/api/auth", userRoutes);

// Middleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use("/images", express.static(path.join(__dirname, "images")));

// Export de l'application express pour déclaration dans server.js
module.exports = app;
