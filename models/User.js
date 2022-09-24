// Création d'un model user avec mongoose, on importe donc mongoose
const mongoose = require("mongoose");

// On rajoute ce validateur comme plugin qui valide l'unicité de l'email
const uniqueValidator = require("mongoose-unique-validator");

// On crée notre schéma de données dédié à l'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


// Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator);

// On exporte ce schéma sous forme de modèle : le modèle s'appellera user et on lui passe le shéma de données
module.exports = mongoose.model("User", userSchema);
