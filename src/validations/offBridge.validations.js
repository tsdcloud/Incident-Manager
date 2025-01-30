import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";

export const createOffBridge = [
    body("incidentCauseId").notEmpty().withMessage("Invalid incidentCauseId"),
    body("tier").notEmpty().withMessage("Invalid tier"),
    body("container1").optional().notEmpty().withMessage("Invalid container1"),
    body("plomb1").optional().notEmpty().withMessage("Invalid plomb1"),
    body("loader").notEmpty().withMessage("Invalid loader"),
    body("product").notEmpty().withMessage("Invalid product"),
    body("transporter").notEmpty().withMessage("Invalid transporter"),
    body("vehicle").notEmpty().withMessage("Invalid vehicle"),
    body("blNumber").optional().notEmpty().withMessage("Invalid blNumber"),
    body("driver").notEmpty().withMessage("Invalid driver"),
    body("trailer").notEmpty().withMessage("Invalid trailer"),
    body("createdBy").notEmpty().withMessage("Invalid createdBy"),
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


export const updateOffBridge = [
    body("incidentCauseId").optional().notEmpty().withMessage("Invalid incidentCauseId"),
    body("tier").optional().notEmpty().withMessage("Invalid tier"),
    body("container1").optional().notEmpty().withMessage("Invalid container1"),
    body("plomb1").optional().notEmpty().withMessage("Invalid plomb1"),
    body("loader").optional().notEmpty().withMessage("Invalid loader"),
    body("product").optional().notEmpty().withMessage("Invalid product"),
    body("transporter").optional().notEmpty().withMessage("Invalid transporter"),
    body("vehicle").optional().notEmpty().withMessage("Invalid vehicle"),
    body("blNumber").optional().notEmpty().withMessage("Invalid blNumber"),
    body("driver").optional().notEmpty().withMessage("Invalid driver"),
    body("trailer").optional().notEmpty().withMessage("Invalid trailer"),
    body("createdBy").optional().notEmpty().withMessage("Invalid createdBy"),
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