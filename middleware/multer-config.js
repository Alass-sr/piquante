// Importation du middleware multer
const multer = require('multer');


// Création du dictionnaire MYME_TYPEs
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// Création objet de configuration pour multer
const storage = multer.diskStorage({
    // Element de configuration de multer pour le chemin d'enregistrement du dossier
    destination: (req, file, callback) => {
        callback(null, 'images')
    },

    // Element de configuration explication du nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');