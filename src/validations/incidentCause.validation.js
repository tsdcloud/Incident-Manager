import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncidentCause = [
    body("name").notEmpty().withMessage("Nom est requis"),
    body("description").optional().notEmpty().withMessage("Description ne doit pas être vide"),
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


export const updateIncidentCause = [
    body("name").notEmpty().withMessage("Nom ne doit pas être vide"),
    body("description").optional().notEmpty().withMessage("Description ne doit pas être vide"),
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