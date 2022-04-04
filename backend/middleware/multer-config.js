// Import de multer
const multer = require ("multer");

// Dictionnaire des extensions possibles
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Création d'un objet de configuration pour multer
const stockage = multer.diskStorage({
    destination: (requete, fichier, callback) => {
        callback(null, "images")
    },
    filename: (requete, fichier, callback) => {
        const nom = fichier.originalname.split(" ").join("_");
        const extension = MIME_TYPES[fichier.mimetype];
        callback(null, nom + Date.now() + "." + extension);
    }
});

// Export du middleware
module.exports = multer({ stockage}).single("image");