import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createConsommable = [
    body("name").notEmpty().withMessage("Invalid name"),
    body("createdBy").notEmpty().withMessage("Invalid createdBy"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid updatedBy"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({error:true, error_list:error.array()});
        } 
        next();
    }
]


export const updateConsommable = [
    body("name").optional().notEmpty().withMessage("Invalid name"),
    body("createdBy").optional().notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send({error:true, error_list:error.array()});
        } 
        next();
    }
]