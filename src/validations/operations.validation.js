import { body, validationResult } from "express-validator";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";

export const createOperationValidation = [
    // body("content").optional().notEmpty().withMessage('content should not be left empty'),
    body("siteId").notEmpty().isUUID().withMessage('invalid siteId'),
    body("actionType").notEmpty().isIn(['START', 'STOP', 'REFUEL']).withMessage('invalid actionType'),
    body("equipementId").notEmpty().withMessage('invaild equipementId'),
    body("operationDate")
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
            .withMessage("operationDate must be a valid date in ISO 8601 or datetime-local format"),
    (req, res, next)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, errors.array()))
            return
        }
        next();
    }
]

export const updateOperationValidation = [
    body("content").optional().notEmpty().withMessage('content should not be left empty'),
    body("siteId").optional().notEmpty().isUUID().withMessage('invalid siteId'),
    body("actionType").optional().notEmpty().isIn(['START', 'STOP', 'REFUEL']).withMessage('invalid actionType'),
    body("equipementId").optional().notEmpty().withMessage('invaild equipementId'),
    body("operationDate")
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
            .withMessage("operationDate must be a valid date in ISO 8601 or datetime-local format"),
    
    (req, res, next)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, errors.array()))
            return
        }
        next();
    }
]