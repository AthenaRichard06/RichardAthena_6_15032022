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
    console.log(sauceObjet);
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
    if (requete.file) {
        Sauce.findOne({ _id: requete.params.id })
        .then((sauce) => {
            const nomFichier = sauce.imageUrl.split("/images/")[1];
            fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
    }
    const sauceObjet = requete.file ?
    {
        ...JSON.parse(requete.body.sauce),
        imageUrl: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
    } : { ...requete.body };
    Sauce.updateOne({ _id: requete.params.id }, {
        ...sauceObjet, _id: requete.params.id
    })
        .then(() => reponse.status(200).json({ message : "Sauce modifiée !"}))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Suppresion d'une sauce
exports.suppressionSauce = (requete, reponse, next) => {
    Sauce.findOne({ _id: requete.params.id })
        .then((sauce) => {
            if (!sauce) {
                return reponse.status(404).json({ erreur })
            }
            if (sauce.userId !== requete.auth.userId) {
                return reponse.status(401).json({ erreur })
            }
            const nomFichier = sauce.imageUrl.split("/images/")[1];
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





// exports.likerUneSauce = (requete, reponse, next) => {
//     switch (requete.body.like) {
//       case 1:
//         Sauce.updateOne(
//           { _id: requete.params.id },
//           { $push: { usersLiked: requete.body.userId }, $inc: { likes: +1 } }
//         )
//           .then(() => reponse.status(200).json({ message: "J'aime" }))
//           .catch((error) => reponse.status(400).json({ error }));
  
//         break;
  
//       case 0:
//         Sauce.findOne({ _id: requete.params.id })
//           .then((sauce) => {
//             if (sauce.usersLiked.includes(requete.body.userId)) {
//               Sauce.updateOne(
//                 { _id: requete.params.id },
//                 { $pull: { usersLiked: requete.body.userId }, $inc: { likes: -1 } }
//               )
//                 .then(() => reponse.status(200).json({ message: "Neutre" }))
//                 .catch((error) => reponse.status(400).json({ error }));
//             }
//             if (sauce.usersDisliked.includes(requete.body.userId)) {
//               Sauce.updateOne(
//                 { _id: requete.params.id },
//                 {
//                   $pull: { usersDisliked: requete.body.userId },
//                   $inc: { dislikes: -1 },
//                 }
//               )
//                 .then(() => reponse.status(200).json({ message: "Neutre" }))
//                 .catch((error) => reponse.status(400).json({ error }));
//             }
//           })
//           .catch((error) => reponse.status(404).json({ error }));
//         break;
  
//       case -1:
//         Sauce.updateOne(
//           { _id: requete.params.id },
//           { $push: { usersDisliked: requete.body.userId }, $inc: { dislikes: +1 } }
//         )
//           .then(() => {
//             reponse.status(200).json({ message: "J'aime pas" });
//           })
//           .catch((error) => reponse.status(400).json({ error }));
//         break;
  
//       default:
//         console.log(error);
//     }
//   };

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
                    console.log ("C'est un like à partir de rien !");
                    console.log ("Réponse A : " + sauce.likes + " et " + sauce.dislikes + ", les likeurs sont " + sauce.usersLiked + " et les dislikers sont " + sauce.usersDisliked);
                // Si l'utilisateur dislike, alors +1
                } else if (requete.body.like == -1) {
                    sauce.usersDisliked.push(requete.body.userId);
                    sauce.dislikes += 1;
                    console.log ("C'est un dislike à partir de rien !");
                    console.log ("Réponse B : " + sauce.likes + " et " + sauce.dislikes + ", les likeurs sont " + sauce.usersLiked + " et les dislikers sont " + sauce.usersDisliked);
                };
            };
            // Cas où la sauce est déjà likée et que l'utilisateur veut annuler son like
            if (sauce.usersLiked.indexOf(requete.body.userId) != -1 && requete.body.like == 0) {
                const rechercheLikeur = sauce.usersLiked.findIndex (utilisateur => utilisateur === requete.body.userId);
                sauce.usersLiked.splice(rechercheLikeur, 1);
                sauce.likes -= 1;
                console.log ("Dommage, like annulé !");
                console.log ("Réponse C : " + sauce.likes + " et " + sauce.dislikes + ", les likeurs sont " + sauce.usersLiked + " et les dislikers sont " + sauce.usersDisliked);
            };
            // Cas où la sauce est déjà dislikée et que l'utilisateur veut annuler son dislike
            if (sauce.usersDisliked.indexOf(requete.body.userId) != -1 && requete.body.like == 0) {
                const rechercheDislikeur = sauce.usersDisliked.findIndex (utilisateur => utilisateur === requete.body.userId);
                sauce.usersDisliked.splice(rechercheDislikeur, 1);
                sauce.dislikes -= 1;
                console.log("Bravo, dislike annulé !");
                console.log ("Réponse D : " + sauce.likes + " et " + sauce.dislikes + ", les likeurs sont " + sauce.usersLiked + " et les dislikers sont " + sauce.usersDisliked);
            };
            sauce.save()
                .then(() => reponse.status(201).json ({ message : "Like ou dislike enregistré !" }))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};