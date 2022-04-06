// Appel du protocole HTTP qui permet de répondre aux requêtes de ce type
const http = require ("http");

// Import de l'application dans le serveur
const application = require ("./app");

// Fonction qui renvoie un port valide
const portValide = valeur => {
    const port = parseInt(valeur, 10);
    if (isNaN(port)) {
        return valeur;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Sur quel serveur lire l'application
const port = portValide (process.env.PORT || "3000");
application.set ("port", port);

// Fonction qui recherche les erreurs
const rechercheErreurs = erreur => {
    if (erreur.syscall != "listen") {
        throw erreur;
    }
    const adresse = serveur.address();
    const liaison = typeof adresse === "string" ? "pipe " + adresse : "port : " + port;
    switch (erreur.code) {
        case "EACCES":
            console.error (liaison + " requiert des privilèges élevés.");
            process.exit (1);
            break;
        case "EADDRINUSE":
            console.error (liaison + " est déjà en cours d'utilisation.");
            process.exit (1);
            break;
        default:
            throw erreur;
    }
};

// Création du serveur et écoute sur le port 3000
const serveur = http.createServer (application);

serveur.on ("Erreur : ", rechercheErreurs);
serveur.on ("Ecoute : ", () => {
    const adresse = serveur.adress();
    const liaison = typeof adresse === "string" ? "pipe " + adresse : "port : " + port;
    console.log ("Ecoute la " + liaison);
})

serveur.listen (process.env.PORT || 3000);