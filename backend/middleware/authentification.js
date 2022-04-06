// Import des variables d'environnement stockées dans le fichier .env
const dotenv = require("dotenv");
dotenv.config();

// Import de jsonwebtoken
const jsonwebtoken = require ("jsonwebtoken");

// Export du middleware
module.exports = (requete, reponse, next) => {
    try {
        const token = requete.headers.authorization.split(" ")[1];
        const decoderToken = jsonwebtoken.verify(token, `${process.env.Token}`);
        const userId = decoderToken.userId;
        requete.auth = { userId };
        if (requete.body.userId && requete.body.userId !== userId) {
            throw "User ID non valable !";
        } else {
            next();
        }
    } catch (erreur) {
        reponse.status(401).json({ erreur });
    }
};