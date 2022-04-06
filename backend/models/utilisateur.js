// Import de Mongoose
const mongoose = require ("mongoose");

// Import du validateur unique
const uniqueValidator = require ("mongoose-unique-validator");

// Création du schéma de données
const utilisateurSchema = mongoose.Schema ({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Application du validateur au schéma, qui permet de valider les données, notamment l'email unique
utilisateurSchema.plugin (uniqueValidator);

// Export du modèle
module.exports = mongoose.model ("Utilisateur", utilisateurSchema);