// Import du modèle sauceSchema
const Sauce = require ("../models/sauce");

// Import de file system de Node
const fileSystem = require ("fs");

// Logiques métiers des différentes demandes CRUD
// Création d'un sauce
exports.creationSauce = (requete, reponse, next) => {
    const sauceObjet = JSON.parse(requete.body.sauce);
    // Suppression de l'Id créé automatiquement par le frontend
    delete sauceObjet._id;
    // Création d'une nouvelle sauce, à partir des éléments compris dans la requête du body
    const sauce = new Sauce ({
        ...sauceObjet,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
    });
    // On enregistre la sauce dans la base de données
    sauce.save()
        .then(() => reponse.status(201).json ({ message : "Sauce enregistrée " }))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Modification d'une sauce
exports.modificationSauce = (requete, reponse, next) => {
    // Si un fichier est fourni, on supprime l'image qui existe déjà
    if (requete.file) {
        Sauce.findOne({ _id: requete.params.id })
        .then((sauce) => {
            const nomFichier = sauce.imageUrl.split("/images/")[1];
            fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
    }
    Sauce.findOne({ _id: requete.params.id })
    .then((sauce) => {
        // On demande si un fichier accompagne la requête/modification
        const sauceObjet = requete.file ?
        {
        // Si oui, mise à jour complète de la sauce, à partir des éléments compris dans la requête du body
        ...JSON.parse(requete.body.sauce),
        imageUrl: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
        // Si non, mise à jour de la sauce, à partir des autres éléments de la requête du body
        } : { ...requete.body };
        // On vérifie que l'Id de l'utilisateur est le même que l'Id de celui qui a crée la sauce
        if (sauce.userId !== requete.auth.userId) {
            return reponse.status(401).json({ erreur })
        }
        // On enregistre la sauce
        Sauce.updateOne({ _id: requete.params.id }, {
            ...sauceObjet, _id: requete.params.id
        })
            .then(() => reponse.status(200).json({ message : "Sauce modifiée !"}))
            .catch(erreur => reponse.status(400).json({ erreur }));
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Suppresion d'une sauce
exports.suppressionSauce = (requete, reponse, next) => {
    // On recherche la sauce correspondante
    Sauce.findOne({ _id: requete.params.id })
        .then((sauce) => {
            // On vérifie si on trouve la sauce, sinon erreur
            if (!sauce) {
                return reponse.status(404).json({ erreur })
            }
            // On vérifie que l'Id de l'utilisateur est le même que l'Id de celui qui a crée la sauce
            if (sauce.userId !== requete.auth.userId) {
                return reponse.status(401).json({ erreur })
            }
            const nomFichier = sauce.imageUrl.split("/images/")[1];
            // On supprime l'image dans le dossier, puis on supprime la sauce de la base de données
            fileSystem.unlink(`images/${nomFichier}`, () => {
                Sauce.deleteOne({ _id: requete.params.id })
                    .then(() => reponse.status(200).json({ message : "Sauce supprimée !"}))
                    .catch(erreur => reponse.status(400).json({ erreur }));
            })
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};

// Affichage d'une sauce
exports.affichageUneSauce = (requete, reponse, next) => {
    Sauce.findOne({ _id: requete.params.id })
        .then(sauce => reponse.status(200).json(sauce))
        .catch(erreur => reponse.status(404).json({ erreur }));
};

// Affichage de toutes les sauces
exports.affichageToutesSauces = (requete, reponse, next) => {
    Sauce.find()
        .then(sauces => reponse.status(200).json(sauces))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Ajout et/ou suppression d'un like ou dislike
exports.likerUneSauce = (requete, reponse, next) => {
    Sauce.findOne({ _id: requete.params.id })
        .then((sauce) => {
            // Cas où la sauce n'a pas encore de like ni de dislike
            if (sauce.usersDisliked.indexOf(requete.body.userId) == -1 && sauce.usersLiked.indexOf(requete.body.userId) == -1) {
                // Si l'utilisateur like, alors +1
                if (requete.body.like == 1) {
                    sauce.usersLiked.push(requete.body.userId);
                    sauce.likes += 1;
                // Si l'utilisateur dislike, alors +1
                } else if (requete.body.like == -1) {
                    sauce.usersDisliked.push(requete.body.userId);
                    sauce.dislikes += 1;
                };
            }
            // Cas où la sauce est déjà likée et que l'utilisateur veut annuler son like
            if (sauce.usersLiked.indexOf(requete.body.userId) != -1 && requete.body.like == 0) {
                const rechercheLikeur = sauce.usersLiked.findIndex (utilisateur => utilisateur === requete.body.userId);
                sauce.usersLiked.splice(rechercheLikeur, 1);
                sauce.likes -= 1;
            }
            // Cas où la sauce est déjà dislikée et que l'utilisateur veut annuler son dislike
            if (sauce.usersDisliked.indexOf(requete.body.userId) != -1 && requete.body.like == 0) {
                const rechercheDislikeur = sauce.usersDisliked.findIndex (utilisateur => utilisateur === requete.body.userId);
                sauce.usersDisliked.splice(rechercheDislikeur, 1);
                sauce.dislikes -= 1;
            };
            sauce.save()
                .then(() => reponse.status(201).json ({ message : "Like ou dislike enregistré !" }))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};