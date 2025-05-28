import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createMovementValidation = [
    body("equipementId").notEmpty().isUUID().withMessage("Invalid equipementId"),
    body("originSite").notEmpty().withMessage("originSite is required"),
    body("destinationSite").notEmpty().withMessage("destinationSite is required"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
    (req, res, next) =>{
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


export const updateMovementValidation = [
    body("equipementId").optional().notEmpty().isUUID().withMessage("Invalid equipementId"),
    body("originSite").optional().notEmpty().withMessage("originSite is required"),
    body("destinationSite").optional().notEmpty().withMessage("destinationSite is required"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
    (req, res, next) =>{
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