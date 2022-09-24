// On importe mongoose
const mongoose = require("mongoose");

// Création d'un schema mangoose pour que les données de la base MongoDB
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: String, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

// On exporte ce shéma de données, on va donc pouvoir utiliser ce modèle pour intéragir avec l'application
module.exports = mongoose.model("Sauces", sauceSchema);
