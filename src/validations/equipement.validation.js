import { body, validationResult } from "express-validator";
import HTTP_STATUS from "../utils/http.utils.js";



export const createEquipementValidation = [
    body("title").notEmpty().withMessage("Le nom est requis"),
    body("operatingMode").notEmpty().withMessage("Le mode d'operation est requis"),
    body("lifeSpan").notEmpty().withMessage("La durée de vie est requis"),
    body("scrapDate").notEmpty().withMessage("La date de rebus est requis"),
    body("lastMaintenance").notEmpty().withMessage("Le nom ne doit pas être vide"),
    body("periodicity").notEmpty().withMessage("La périodicité ne doit pas être vide"),
    body("equipmentGroupId").notEmpty().withMessage("Le group d'equipement ne doit pas être vide"),
    (req, res, next) =>{
        let errors = validationResult(req.body);
        if(!errors.isEmpty()){
            let formated = errors.array().map(err=>{
                return  {
                    msg:err.msg,
                    field: err.path
                }
            });
            
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, formated));
            return;
        } 
        next();
    }
]


export const updateEquipementValidation = [
    body("title").notEmpty().withMessage("Le nom ne doit pas être vide"),
    body("operatingMode").notEmpty().withMessage("Le mode d'operation ne doit pas être vide"),
    body("lifeSpan").notEmpty().withMessage("La durée de vie ne doit pas être vide"),
    body("scrapDate").notEmpty().withMessage("La date de rebus ne doit pas être vide"),
    body("lastMaintenance").notEmpty().withMessage("Le nom ne doit pas être vide"),
    body("periodicity").notEmpty().withMessage("La périodicité ne doit pas être vide"),
    body("equipmentGroupId").notEmpty().withMessage("Le group d'equipement ne doit pas être vide"),
    (req, res, next) =>{
        let errors = validationResult(req.body);
        if(!errors.isEmpty()){
            let formated = errors.array().map(err=>{
                return  {
                    msg:err.msg,
                    field: err.path
                }
            });
            
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, formated));
            return;
        } 
        next();
    }
]