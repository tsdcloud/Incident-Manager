import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createMaintenanceType = [
    body("name").notEmpty().withMessage("Invalid name"),
    body("createdBy").notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(error.array())
            return;
        } 
        next();
    }
]


export const updateMaintenanceType = [
    body("name").optional().notEmpty().withMessage("name should not be empty"),
    body("createdBy").optional().notEmpty().withMessage("createdby should not be empty"),
    body("updatedBy").optional().notEmpty().withMessage("updatedby should not be empty"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(error.array())
            return;
        } 
        next();
    }
]