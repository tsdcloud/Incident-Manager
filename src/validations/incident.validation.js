import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createIncident = [
    body("incidentId").notEmpty().withMessage("incidentId is required"),
    body("equipementId").notEmpty().withMessage("equipementId is required"),
    body("siteId").notEmpty().withMessage("siteId is required"),
    body("shiftId").notEmpty().withMessage("shiftId is required"),
    body("consomableId").notEmpty().withMessage("consomableId is required"),
    body("incidentCauseId").notEmpty().withMessage("incidentCauseId is required"),
    body("userId").notEmpty().withMessage("userId is required"),
    body("description").optional().notEmpty().withMessage("description should not be empty"),
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


export const updateIncident = [
    body("incidentId").notEmpty().withMessage("incidentId should not be empty"),
    body("equipementId").notEmpty().withMessage("equipementId should not be empty"),
    body("siteId").notEmpty().withMessage("siteId should not be empty"),
    body("shiftId").notEmpty().withMessage("shiftId should not be empty"),
    body("consomableId").notEmpty().withMessage("consomableId should not be empty"),
    body("incidentCauseId").notEmpty().withMessage("incidentCauseId should not be empty"),
    body("userId").notEmpty().withMessage("userId should not be empty"),
    body("description").optional().notEmpty().withMessage("description should not be empty"),
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