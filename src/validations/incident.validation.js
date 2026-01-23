import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncidentValidation = [
    // body("incidentId").notEmpty().withMessage("Le type d'incident est requis"),
    body("equipementId").notEmpty().withMessage("L'équipement est requis"),
    body("siteId").notEmpty().withMessage("Le site est requis"),
    body("shiftId").notEmpty().withMessage("Le shift est requis"),
    body("photos.*.url").optional().isURL().withMessage("L'URL de la photo doit être valide"),
    body("photos.*.filename").optional().notEmpty().withMessage("Le nom du fichier est requis"),
    // body("consomableId").optional().notEmpty().withMessage("consomableId is required"),
    // body("incidentCauseId").notEmpty().withMessage("incidentCauseId is required"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({
                "error": true,
                "error_list": error.array()
            });
            return;
        } 
        next();
    }
]


// export const updateIncidentValidation = [
//     body("incidentId").optional().bail().notEmpty().withMessage("incidentId should not be empty"),
//     body("equipementId").optional().bail().notEmpty().withMessage("equipementId should not be empty"),
//     body("siteId").optional().bail().notEmpty().withMessage("siteId should not be empty"),
//     body("shiftId").optional().bail().notEmpty().withMessage("shiftId should not be empty"),
//     body('hasStoppedOperations').optional().bail().isBoolean().withMessage('hasStoppedOperations must be a boolean'),
//     // body("consomableId").optional().bail().notEmpty().withMessage("consomableId should not be empty"),
//     // body("incidentCauseId").optional().bail().notEmpty().withMessage("incidentCauseId should not be empty"),
//     body("status").optional().bail().notEmpty().withMessage("status should not be empty"),
//     body("closedManuDate")
//     .optional().bail()
//     .custom((value) => {
//         if (value === null || value === undefined || value === '') {
//             return true;
//         }
        
//         // Accepter le format datetime-local (YYYY-MM-DDTHH:mm)
//         const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
//         if (datetimeLocalRegex.test(value)) {
//             return true;
//         }
        
//         // Accepter aussi le format ISO complet
//         return validator.isISO8601(value);
//     })
//     .withMessage("closedManuDate must be a valid ISO 8601 date or datetime-local format"),
//     body("photos.*.url").optional().bail().isURL().withMessage("L'URL de la photo doit être valide"),
//     body("photos.*.filename").optional().bail().notEmpty().withMessage("Le nom du fichier est requis"),
//     (req, res, next) =>{
//         const error = validationResult(req);
//         if(!error.isEmpty()){
//             res
//             .status(HTTP_STATUS.BAD_REQUEST.statusCode)
//             .send({
//                 "error": true,
//                 "error_list": error.array()
//             });
//             return;
//         } 
//         next();
//     }
// ]
export const updateIncidentValidation = [
    body("incidentId")
        .optional({ checkFalsy: true })
        .bail()
        .notEmpty().withMessage("incidentId should not be empty"),
    
    body("equipementId")
        .optional({ checkFalsy: true })
        .bail()
        .notEmpty().withMessage("equipementId should not be empty"),
    
    body("siteId")
        .optional({ checkFalsy: true })
        .bail()
        .notEmpty().withMessage("siteId should not be empty"),
    
    body("shiftId")
        .optional({ checkFalsy: true })
        .bail()
        .notEmpty().withMessage("shiftId should not be empty"),
    
    body('hasStoppedOperations')
        .optional()
        .bail()
        .isBoolean().withMessage('hasStoppedOperations must be a boolean'),
    

    body("incidentCauseId")
        .if(body('status').equals('CLOSED')) // Conditionnel : requis seulement pour CLOSED
        .notEmpty().withMessage("incidentCauseId is required when closing an incident")
        .bail(),
    
    body("incidentCauseId")
        .optional({ checkFalsy: true }) // Optionnel pour les autres cas
        .bail()
        .notEmpty().withMessage("incidentCauseId should not be empty"),
    
    body("status")
        .optional({ checkFalsy: true })
        .bail()
        .notEmpty().withMessage("status should not be empty"),
    
    body("closedManuDate")
        .optional({ checkFalsy: true })
        .bail()
        .custom((value) => {
            if (!value || value === '') {
                return true; // Accepte les valeurs vides
            }
            
            // Accepter le format datetime-local (YYYY-MM-DDTHH:mm)
            const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
            if (datetimeLocalRegex.test(value)) {
                return true;
            }
            
            // Accepter le format ISO avec ou sans millisecondes, avec ou sans Z
            const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
            if (isoRegex.test(value)) {
                return true;
            }
            
            // Vérifier si c'est une date valide avec Date
            const date = new Date(value);
            return !isNaN(date.getTime()); // Retourne true si la date est valide
        })
        .withMessage("closedManuDate must be a valid date in ISO 8601 or datetime-local format"),
    
    body("photos.*.url")
        .optional()
        .bail()
        .isURL().withMessage("L'URL de la photo doit être valide"),
    
    body("photos.*.filename")
        .optional()
        .bail()
        .notEmpty().withMessage("Le nom du fichier est requis"),
    
    (req, res, next) => {
        console.log("Données reçues pour validation:", req.body);
        const error = validationResult(req);
        if(!error.isEmpty()){
            console.log("Erreurs de validation:", error.array());
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({
                "error": true,
                "error_list": error.array()
            });
            return;
        } 
        next();
    }
]