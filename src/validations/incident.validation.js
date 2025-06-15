import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncidentValidation = [
    body("incidentId").notEmpty().withMessage("Le type d'incident est requis"),
    body("equipementId").notEmpty().withMessage("L'équipement est requis"),
    body("siteId").notEmpty().withMessage("Le site est requis"),
    body("shiftId").notEmpty().withMessage("Le shift est requis"),
    // body("consomableId").optional().notEmpty().withMessage("consomableId is required"),
    // body("incidentCauseId").notEmpty().withMessage("incidentCauseId is required"),
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


export const updateIncidentValidation = [
    body("incidentId").optional().notEmpty().withMessage("incidentId should not be empty"),
    body("equipementId").optional().notEmpty().withMessage("equipementId should not be empty"),
    body("siteId").optional().notEmpty().withMessage("siteId should not be empty"),
    body("shiftId").optional().notEmpty().withMessage("shiftId should not be empty"),
    // body("consomableId").optional().notEmpty().withMessage("consomableId should not be empty"),
    // body("incidentCauseId").optional().notEmpty().withMessage("incidentCauseId should not be empty"),
    body("status").optional().notEmpty().withMessage("status should not be empty"),
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