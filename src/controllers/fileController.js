import multer from 'multer';
import excel from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ResponseHandler from '../utils/responseHandler.js';
import dotenv from 'dotenv'; 

dotenv.config();

// Pour obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Création automatique du dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('✅ Dossier uploads créé avec succès');
    } catch (error) {
        console.error('❌ Erreur lors de la création du dossier uploads:', error);
    }
}

const multerOptions = {
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
}

multerOptions.destination = (req, file, cb) => {
    const uploadFile = path.join(__dirname, '..', 'uploads');
    let filePath = uploadFile;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }
    cb(null, filePath);
}

const storage = multer.diskStorage(multerOptions);

// Export de la configuration multer
export const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

// Fonction utilitaire pour construire l'URL
const buildFileUrl = (filename) => {
    if (process.env.USE_FULL_URL === 'true') {
        return `https://${process.env.ADDRESS}/api/files/download/${filename}`;
    }
    return `http://${process.env.ADDRESS}:${process.env.PORT}/api/files/download/${filename}`;
};

export const uploadFile = (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return ResponseHandler.error(res, 'Aucun fichier n\'a été téléchargé', 'BAD_REQUEST');
        }

        const uploadedFiles = req.files.map((file) => {
            // const currentDateTime = new Date().toISOString().replace(/:/g, '-');
            const currentDateTime = new Date().toISOString().replace(/:/g, '-');
            const fileExtension = path.extname(file.filename);
            const newFilename = `${path.basename(file.filename, fileExtension)}_${currentDateTime}${fileExtension}`;
            const filePath = path.join(__dirname, '..', 'uploads', newFilename);
            
            fs.renameSync(file.path, filePath);

            return {
                filename: newFilename,
                filePath,
                url: buildFileUrl(newFilename),
            };
        });

        return ResponseHandler.success(res, uploadedFiles);
    } catch (error) {
        console.error('Erreur lors du téléchargement des fichiers:', error);
        return ResponseHandler.error(res, 'Erreur lors du téléchargement des fichiers');
    }
};

export const toExcel = async (req, res) => {
    const { data, headings } = req.body;

    if (!Array.isArray(data)) { 
        return ResponseHandler.error(res, 'Format de données invalide. Un tableau d\'objets est attendu.', 'BAD_REQUEST'); 
    }
    
    // Create a new Excel workbook and worksheet 
    const workbook = new excel.Workbook(); 
    const worksheet = workbook.addWorksheet('Sheet 1'); 
    
    worksheet.addRow(headings);
    data.forEach(obj => worksheet.addRow(Object.values(obj)));
    
    // Define the file path 
    const filePath = path.join(__dirname, '..', 'uploads', `exported_${Date.now()}.xlsx`); 
    
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        console.log('Le fichier existe déjà.');
    } catch {
        await fs.promises.writeFile(filePath, '');
        console.log('Fichier Excel créé avec succès!');
        await workbook.xlsx.writeFile(filePath); 
    }
    
    return ResponseHandler.success(res, { 
        fileUrl: buildFileUrl(path.basename(filePath))
    });
}

// export const download = async (req, res) => {
//     const filename = req.params.filename;   
//     const filePath = path.join(__dirname, '..', 'uploads', filename);

//     if (fs.existsSync(filePath)) {
//         res.download(filePath, err => {
//             if (err) {
//                 console.error('Erreur lors du téléchargement du fichier:', err);
//                 return ResponseHandler.error(res, 'Erreur lors du téléchargement du fichier');
//             }
//         });
//     } else {
//         return ResponseHandler.error(res, 'Fichier non trouvé', 'NOT_FOUND');
//     }
// };
export const download = async (req, res) => {
    try {
        const filename = req.params.filename;   
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        if (!fs.existsSync(filePath)) {
            return ResponseHandler.error(res, 'Fichier non trouvé', 'NOT_FOUND');
        }

        // Utiliser res.sendFile pour éviter les conflits de headers
        res.sendFile(filePath, err => {
            if (err) {
                console.error('Erreur lors du téléchargement du fichier:', err);
                if (!res.headersSent) {
                    return ResponseHandler.error(res, 'Erreur lors du téléchargement du fichier');
                }
            }
        });
    } catch (error) {
        console.error('Erreur dans la route download:', error);
        if (!res.headersSent) {
            return ResponseHandler.error(res, 'Erreur lors du téléchargement du fichier');
        }
    }
};


export const uploadFiless = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return ResponseHandler.error(res, 'Aucun fichier fourni');
        }

        const uploadedFiles = req.files.map(file => {
            const currentDateTime = new Date().toISOString().replace(/:/g, '-');
            const fileExtension = path.extname(file.originalname);
            const newFilename = `${path.basename(file.originalname, fileExtension)}_${currentDateTime}${fileExtension}`;
            const filePath = path.join(__dirname, '..', 'uploads', newFilename);
            
            // Déplacer le fichier vers le bon emplacement
            fs.renameSync(file.path, filePath);

            return {
                filename: newFilename,
                originalName: file.originalname,
                size: file.size,
                path: filePath,
                url: buildFileUrl(newFilename)
            };
        });

        return ResponseHandler.success(res, {
            message: 'Fichiers téléversés avec succès',
            files: uploadedFiles
        });

    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return ResponseHandler.error(res, 'Erreur lors de l\'upload des fichiers');
    }
};

export const uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return ResponseHandler.error(res, 'Aucun fichier fourni');
        }
        const uploadedFiles = req.files.map(file => {
            const newFilename = `${Date.now()}-${file.originalname}`;
            const newPath = path.join(__dirname, '..', 'uploads', newFilename);
            fs.renameSync(file.path, newPath);
            const isVideo = file.mimetype.startsWith('video/');
            return {
                filename: newFilename,
                originalName: file.originalname,
                size: file.size,
                type: isVideo ? 'video' : 'file',
                url: buildFileUrl(newFilename)
            };
        });
        return ResponseHandler.success(res, {
            message: 'Fichiers téléversés avec succès',
            files: uploadedFiles
        });
    } catch (err) {
        console.error('Upload error:', err);
        return ResponseHandler.error(res, 'Erreur lors de l\'upload');
    }
};