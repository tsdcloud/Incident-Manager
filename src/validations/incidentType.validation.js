import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";
const equipmentDomain = [
    'IT',
    'HSE',
    'OPERATIONS',
    'MAINTENANCE'
];

export const createIncidentType = [
    body("name").notEmpty().withMessage("Nom est requis"),
    body("description").optional().notEmpty().withMessage("Description ne doit pas être vide"),
    body('domain').optional().isIn(equipmentDomain).withMessage('Le domaine doit être IT, HSE, OPERATIONS ou MAINTENANCE'),
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


export const updateIncidentType = [
    body("name").optional().notEmpty().withMessage("Nom est requis"),
    body("description").optional().notEmpty().withMessage("Invalid description"),
    body('domain').optional().isIn(equipmentDomain).withMessage('Le domaine doit être IT, HSE, OPERATIONS ou MAINTENANCE'),
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