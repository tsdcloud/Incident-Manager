import { body, validationResult } from 'express-validator';
import HTTP_STATUS from '../utils/http.utils.js';
import { apiResponse } from '../utils/apiResponse.js';

// Creation validation
export const createEquipmentGroupValidation = [
    body('name').notEmpty().withMessage('Nom est requis'),
    body('equipmentGroupFamilyId').notEmpty().withMessage('Famille d\'equipement est requise'),
    body('description').optional().notEmpty().withMessage('Description ne doit pas être vide'),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            let formated = error.array().map(err=>{
                return  {
                    msg:err.msg,
                    field: err.path
                }
            });
            
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, formated));
            return;
        } 
        next();
    }
]


// Update validation
export const updateEquipmentGroupValidation = [
    body('name').optional().notEmpty().withMessage('Nom ne doit pas être vide'),
    body('equipmentGroupFamilyId').optional().notEmpty().withMessage('Famille d\'équipement ne doit pas être vide'),
    body('description').optional(),
    
    // Validation conditionnelle
    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            // Filtrer seulement les erreurs pour les champs qui sont présents dans la requête
            const bodyFields = Object.keys(req.body);
            const filteredErrors = errors.array().filter(error => 
                bodyFields.includes(error.path)
            );
            
            if (filteredErrors.length > 0) {
                let formated = filteredErrors.map(err => ({
                    msg: err.msg,
                    field: err.path
                }));
                
                return res
                    .status(HTTP_STATUS.BAD_REQUEST.statusCode)
                    .send(apiResponse(true, formated));
            }
        }
        next();
    }
];