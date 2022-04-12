// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du middleware email pour contrôler l'email
const emailControle = require ("../middleware/email");

// Import du middleware motdepasse pour contrôler le mot de passe
const motdepasseControle = require ("../middleware/motdepasse");

// Import du middleware connexion pour limiter les tentatives de connexion
const connexionControle = require ("../middleware/connexion");

// Import du contrôleur utilisateur
const utilisateurControle = require ("../controllers/utilisateur");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/signup', emailControle, motdepasseControle, utilisateurControle.creationCompte);
router.post('/login', connexionControle, utilisateurControle.connexionCompte);

// Export du router
module.exports = router;