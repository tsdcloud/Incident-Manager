import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

// export const createIncidentCause = [
//     body("name").notEmpty().withMessage("Nom est requis"),
//     body("description").optional().notEmpty().withMessage("Description ne doit pas être vide"),
//     body("incidentTypeId").optional().notEmpty().withMessage("Le type d'incident ne doit pas être vide"),
//     (req, res, next) =>{
//         const error = validationResult(req);
//         if(!error.isEmpty()){
//             res
//             .status(HTTP_STATUS.BAD_REQUEST.statusCode)
//             .send({
//                 "error": true,
//                 "errors": error.array()
//             });
//             return;
//         } 
//         next();
//     }
// ]
export const createIncidentCause = [
    // Nom est obligatoire
    body("name")
        .notEmpty().withMessage("Nom est requis")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Le nom doit contenir entre 2 et 100 caractères"),
    
    // Description est optionnelle et peut être null/vide
    body("description")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage("La description ne doit pas dépasser 500 caractères"),
    
    // incidentTypeId est optionnel et peut être null/vide
    body("incidentTypeId")
        .optional({ nullable: true, checkFalsy: true })
        .isUUID().withMessage("L'ID du type d'incident doit être un UUID valide"),
    
    // Middleware pour nettoyer les données avant validation
    (req, res, next) => {
        // Nettoyer les données : transformer les chaînes vides en undefined
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === "" || req.body[key] === null) {
                req.body[key] = undefined;
            }
        });
        
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({
                "error": true,
                "errors": error.array()
            });
            return;
        } 
        next();
    }
]


export const updateIncidentCause = [
    // Nom est optionnel pour l'update
    body("name")
        .optional({ nullable: true, checkFalsy: true })
        .notEmpty().withMessage("Si fourni, le nom ne doit pas être vide")
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage("Si fourni, le nom doit contenir entre 2 et 100 caractères"),
    
    // Description est optionnelle et peut être null/vide
    body("description")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage("Si fourni, la description ne doit pas dépasser 500 caractères"),
    
    // incidentTypeId est optionnel et peut être null/vide
    body("incidentTypeId")
        .optional({ nullable: true, checkFalsy: true })
        .isUUID().withMessage("Si fourni, l'ID du type d'incident doit être un UUID valide"),
    
    // Middleware pour nettoyer les données avant validation
    (req, res, next) => {
        // Nettoyer les données
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === "" || req.body[key] === null) {
                req.body[key] = undefined;
            }
        });
        
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({
                "error": true,
                "errors": error.array()
            });
            return;
        } 
        next();
    }
]