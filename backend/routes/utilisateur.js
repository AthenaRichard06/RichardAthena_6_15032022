// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur sauce
const utilisateurControle = require ("../controllers/utilisateur");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/signup', utilisateurControle.creationCompte);
router.post('/login', utilisateurControle.connexionCompte);

// Export du router
module.exports = router;