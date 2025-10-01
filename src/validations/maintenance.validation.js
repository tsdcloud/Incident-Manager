import { body, param, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createMaintenance = [
    // body("createdBy").notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({
                "error": true,
                "error_list": error.array()
            });
        } 
        next();
    }
]


export const updateMaintenance = [
    body("createdBy").optional().notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
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

export const closeMaintenance = [
    body("incidentCauseId").notEmpty().withMessage("Invalid incidentCauseId"),
    body("supplierId").notEmpty().withMessage("Invalid supplierId"),
    body("incidentId").notEmpty().withMessage("Invalid incidentId"),
    body("closedManuDate")
    .optional()
    .custom((value) => {
        if (value === null || value === undefined || value === '') {
            return true;
        }
        
        // Accepter le format datetime-local (YYYY-MM-DDTHH:mm)
        const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (datetimeLocalRegex.test(value)) {
            return true;
        }
        
        // Accepter aussi le format ISO complet
        return validator.isISO8601(value);
    })
    .withMessage("closedManuDate must be a valid ISO 8601 date or datetime-local format"),
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