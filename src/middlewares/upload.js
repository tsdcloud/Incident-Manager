// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Pour obtenir __dirname en ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configuration du stockage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // ✅ Extensions vidéo + images + documents autorisés
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|mov|avi|mkv|webm|3gp|ogv/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
//     // Types MIME vidéo valides
//     const allowedMimeTypes = [
//         'video/mp4',
//         'video/quicktime', // .mov
//         'video/x-msvideo', // .avi
//         'video/x-matroska', // .mkv
//         'video/webm',
//         'video/3gpp',
//         'video/ogg'
//     ];

//     const mimetype = allowedMimeTypes.includes(file.mimetype) || 
//                     /image\/|application\/pdf|text\//.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Type de fichier non supporté'));
//     }
// };

// // Configuration Multer
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 50 * 1024 * 1024 // ⬆️ Augmenté à 50MB pour les vidéos
//     },
//     fileFilter: fileFilter
// });

// export default upload; // ← Export par défaut
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du stockage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// ✅ Extensions autorisées (ajout des formats Excel/CSV)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls|csv|mp4|mov|avi|mkv|webm|3gp|ogv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Types MIME valides (ajout des MIME Excel/CSV)
    const allowedMimeTypes = [
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-matroska',
        'video/webm',
        'video/3gpp',
        'video/ogg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    const mimetype = allowedMimeTypes.includes(file.mimetype) || 
                    /image\/|application\/pdf|text\//.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté'));
    }
};

// Configuration Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB (suffisant pour Excel/CSV et vidéos)
    },
    fileFilter: fileFilter
});

export default upload;