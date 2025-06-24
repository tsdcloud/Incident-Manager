import { body, validationResult } from 'express-validator';
import HTTP_STATUS from '../utils/http.utils.js';
import { apiResponse } from '../utils/apiResponse.js';

// Creation validation
export const createEquipmentGroupFamilyValidation = [
    body('name').notEmpty().withMessage('Nom est requis'),
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
export const updateEquipmentGroupFamilyValidation = [
    body('name').optional().notEmpty().withMessage('Nom ne doit pas être vide'),
    body('description').optional().notEmpty().withMessage('Description ne doit pas être vide'),
    (req,res, next)=>{
        let errors = validationResult(req.body);
        if(!errors.isEmpty()){
            let formated = errors.array().map(err=>{
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