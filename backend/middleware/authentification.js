// Import des variables d'environnement stockées dans le fichier .env
const dotenv = require("dotenv");
dotenv.config();

// Import de jsonwebtoken qui crée et vérifie les token
const jsonwebtoken = require ("jsonwebtoken");

// Export du middleware d'authentification
module.exports = (requete, reponse, next) => {
    try {
        // On récupère le token tout en splitant le "Bearer" présent au début
        const token = requete.headers.authorization.split(" ")[1];
        // On décode le token avec la clé secrète "process.env.Token"
        const decoderToken = jsonwebtoken.verify(token, `${process.env.Token}`);
        // On récupère l'Id du token
        const userId = decoderToken.userId;
        // On ajoute l'attribut "auth" à la requête pour qu'il soit utilisable sur tous les middlewares 
        requete.auth = { userId };
        // On compare l'userId avec celui récupéré dans le token
        if (requete.body.userId && requete.body.userId !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (erreur) {
        reponse.status(401).json({ erreur });
    }
};