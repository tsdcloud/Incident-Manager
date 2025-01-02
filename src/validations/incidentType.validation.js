import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncidentType = [
    body("name").notEmpty().withMessage("Invalid name"),
    body("createdBy").notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .send(error.array())
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            return;
        } 
        next();
    }
]


export const updateIncidentType = [
    body("name").optional().notEmpty().withMessage("Invalid name"),
    body("createdBy").optional().notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .send(error.array())
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            return;
        } 
        next();
    }
]