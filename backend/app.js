// Import des variables d'environnement stockées dans le fichier .env
const dotenv = require("dotenv");
dotenv.config();

// Import d'Express pour créer des applications avec Node.js
const express = require ("express");

// Import de Mongoose
const mongoose = require ("mongoose");

// Import de helmet pour sécuriser les requêtes http d'express
const helmet = require("helmet");

// Import de mongo-sanatize pour nettoyer les données des utilisateurs (empêche l'injection)
const mongoSanitize = require ("express-mongo-sanitize"); 

// Import de path pour le chemin des images
const path = require ("path");

// Import des router
const sauceRoutes = require ("./routes/sauce");
const utilisateurRoutes = require ("./routes/utilisateur");

// Import de cors pour sécuriser l'accès à l'API, réservé ici à localhost:4200
const cors = require ("cors");
let corsOptions = {
    origin: 'http://localhost:4200'
}

// Connexion de l'API à la base de données MongoDB
mongoose.connect(`mongodb+srv://${process.env.Mongo_Utilisateur}:${process.env.Mongo_Motdepasse}@${process.env.Mongo_Hote}/${process.env.Mongo_Nom}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Création de l'application
const application = express();

// Intercepte toutes les requêtes qui ont un content-type json et nous met à dispo le body dans le contenu de la requête
application.use (express.json());

// Erreurs de CORS à corriger
application.use((requete, reponse, next) => {
    reponse.setHeader('Access-Control-Allow-Origin', '*');
    reponse.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    reponse.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Utilisation de cors
application.use(cors(corsOptions));

// Utilisation de helmet pour sécuriser les en-têtes, en cross-origins pour permettre à l'utilisateur d'accéder à des ressoucres d'un autre serveur
application.use (helmet.crossOriginResourcePolicy ({ policy : "cross-origin" }));

// Par défaut, les caractères $ et . sont complètement supprimés des entrées fournies par l'utilisateur aux endroits suivants : req.body, req.params, req.headers, req.query
// Pour supprimer les données en utilisant ces valeurs par défaut
application.use(mongoSanitize());

// Utilisation des images dans le dossier statique
application.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation des router
application.use ("/api/sauces", sauceRoutes);
application.use ("/api/auth", utilisateurRoutes);

// Export de l'application
module.exports = application;