import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createEquipement = [
    body("name").notEmpty().withMessage("Invalid name"),
    body("siteId").notEmpty().withMessage("Invalid siteId"),
    body("createdBy").notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
    (req, res, next) =>{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(error.array());
        } 
        next();
    }
]


export const updateEquipement = [
    body("name").optional().notEmpty().withMessage("Invalid name"),
    body("siteId").optional().notEmpty().withMessage("Invalid siteId"),
    body("createdBy").optional().notEmpty().withMessage("Invalid user"),
    body("updatedBy").optional().notEmpty().withMessage("Invalid user"),
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