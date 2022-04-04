// Import d'Express
const express = require ("express");

// Création d'un router via Express
const router = express.Router();

// Import du contrôleur sauce
const sauceControle = require ("../controllers/sauce");

// Import du middleware d'authentification
const authentification = require ("../middleware/authentification");

// Import du middleware mutler
const multer = require ("../middleware/multer-config");

// Utilisation de l'application via l'implémenter du CRUD (creation, read, update, delete)
router.post('/', authentification, multer, sauceControle.creationSauce);
router.put('/:id', authentification, multer, sauceControle.modificationSauce);
router.delete('/:id', authentification, sauceControle.suppressionSauce);
router.get('/:id', authentification, sauceControle.affichageUneSauce);
router.get('/', authentification, sauceControle.affichageToutesSauces);
router.post('/:id/like', authentification, sauceControle.likerUneSauce);

// Export du router
module.exports = router;