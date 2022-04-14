// Import de password-validator, pour contrôler le mot de passe
const motdepasseValidator = require ("password-validator");

// Création du modèle de mot de passe
const motdepasseSchema = new motdepasseValidator;

motdepasseSchema
    .is().min(8)                                    // 8 caractères minimum
    .is().max(100)                                  // 100 caractères maximum
    .has().uppercase()                              // Doit contenir une cap
    .has().lowercase()                              // Doit contenir une bdc
    .has().digits(2)                                // 2 chiffres minimum
    .has().not().spaces()                           // Ne doit pas avoir d'espace
    .is().not().oneOf(['Passw0rd', 'Password123']); // Empêche l'utilisation de ces mots de passe (très simples, donc pas sécurisés)


// Vérifier si le body.password suit bien le schéma
module.exports = (requete, reponse, next) => {
    if (!motdepasseSchema.validate(requete.body.password)) {
        return reponse.status(400).json({ message : "Votre mot de passe n'est pas conforme" });
    } else {
        next();
    }
};