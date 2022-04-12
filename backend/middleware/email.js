// Import de validator pour vérifier l'email
const validator = require("validator");

// Utilisation et export de validator
module.exports = (requete, reponse, next) => {
    if (!validator.isEmail(requete.body.email)) {
        return reponse.status(400).json({ message : "Votre adresse mail n'est pas valide" });
    } else {
        next();
    }
};