// Import de bcrypt pour hacher les mots de passe
const bcrypt = require ("bcrypt");

// Import du modèle utilisateurSchema
const Utilisateur = require ("../models/utilisateur");

// Import de jsonwebtoken pour créer et vérifier les token
const jsonwebtoken = require ("jsonwebtoken");

// Logiques métiers des différentes demandes CRUD
// Créer un compte
exports.creationCompte = (requete, reponse, next) => {
    // On hache le mot de passe et on le sale dix fois
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
    // On vérifie si l'email utilisé existe dans la base de données
    Utilisateur.findOne({ email: requete.body.email })
        .then(utilisateur => {
            // Si on ne le trouve pas
            if (!utilisateur) {
                return reponse.status(401).json({ erreur });
            }
            // Si on le trouve, on compare le hash du mot de passe utilisé avec celui du mot de passe dans la base de données
            bcrypt.compare(requete.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return reponse.status(401).json({ erreur }); 
                    }
                    reponse.status(200).json({
                        userId: utilisateur._id,
                        // On ajoute ici le token qui contient l'Id de l'utilisateur 
                        token: jsonwebtoken.sign(
                            { userId: utilisateur._id },
                            process.env.Token,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};