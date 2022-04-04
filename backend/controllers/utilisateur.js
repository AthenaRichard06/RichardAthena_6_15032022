// Import de bcrypt pour les mots de passe
const bcrypt = require ("bcrypt");

// Import de jsonwebtoken
const jsonwebtoken = require ("jsonwebtoken");

// Import du modèle utilisateurSchema
const Utilisateur = require ("../models/utilisateur");

// Logiques métiers des différentes demandes CRUD
// Créer un compte
exports.creationCompte = (requete, reponse, next) => {
    bcrypt.hash(requete.body.password, 10)
        .then(hash => {
            const utilisateur = new Utilisateur({
                email: requete.body.email,
                password: hash
            });
            utilisateur.save()
                .then(() => reponse.status(201).json({ message : "Utilisateur créé !"}))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};

// Se connecter
exports.connexionCompte = (requete, reponse, next) => {
    Utilisateur.findOne({ email: requete.body.email })
        .then(utilisateur => {
            if (!utilisateur) {
                return reponse.status(401).json({ erreur });
            }
            bcrypt.compare(requete.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return reponse.status(401).json({ erreur }); 
                    }
                    reponse.status(200).json({
                        userId: user._id,
                        token: jsonwebtoken.sign(
                            { userId: user._id },
                            process.env.Token,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};