import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncidentCause = [
    body("name").notEmpty().withMessage("Invalid name"),
    body("createdBy").optional().notEmpty().withMessage("Invalid createdBy"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid updatedBy"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
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


export const updateIncidentCause = [
    body("name").optional().notEmpty().withMessage("Invalid name"),
    body("createdBy").optional().notEmpty().withMessage("Invalid createdBy"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid updatedBy"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
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