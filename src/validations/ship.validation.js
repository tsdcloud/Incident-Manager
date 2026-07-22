import { body, validationResult } from 'express-validator';
import HTTP_STATUS from '../utils/http.utils.js';
import { apiResponse } from '../utils/apiResponse.js';



// Creation validation
export const createShipValidation = [
    body('name').notEmpty().withMessage('Nom est requis'),
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
export const updateShipValidation = [
    body('name').optional().notEmpty().withMessage('Nom ne doit pas être vide'),
    (req, res, next) => {
        let errors = validationResult(req); 
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