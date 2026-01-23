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


// export const updateEquipementValidation = [
//     body("title").notEmpty().withMessage("Le nom ne doit pas être vide"),
//     body("operatingMode").notEmpty().withMessage("Le mode d'operation ne doit pas être vide"),
//     body("lifeSpan").notEmpty().withMessage("La durée de vie ne doit pas être vide"),
//     body("scrapDate").notEmpty().withMessage("La date de rebus ne doit pas être vide"),
//     body("lastMaintenance").notEmpty().withMessage("Le nom ne doit pas être vide"),
//     body("periodicity").notEmpty().withMessage("La périodicité ne doit pas être vide"),
//     body("equipmentGroupId").notEmpty().withMessage("Le group d'equipement ne doit pas être vide"),
//     (req, res, next) =>{
//         let errors = validationResult(req.body);
//         if(!errors.isEmpty()){
//             let formated = errors.array().map(err=>{
//                 return  {
//                     msg:err.msg,
//                     field: err.path
//                 }
//             });
            
//             res
//             .status(HTTP_STATUS.BAD_REQUEST.statusCode)
//             .send(apiResponse(true, formated));
//             return;
//         } 
//         next();
//     }
// ]
export const updateEquipementValidation = [
    body("numRef").optional().notEmpty().withMessage("Le numéro de référence ne doit pas être vide"),
    body("title").optional().notEmpty().withMessage("Le nom ne doit pas être vide"),
    body("operatingMode").optional().notEmpty().withMessage("Le mode d'operation ne doit pas être vide"),
    body("lifeSpan").optional().notEmpty().withMessage("La durée de vie ne doit pas être vide"),
    body("scrapDate").optional().notEmpty().withMessage("La date de rebus ne doit pas être vide"),
    body("lastMaintenance").optional().notEmpty().withMessage("La dernière maintenance ne doit pas être vide"),
    body("periodicity").optional().notEmpty().withMessage("La périodicité ne doit pas être vide"),
    body("equipmentGroupId").optional().notEmpty().withMessage("Le groupe d'équipement ne doit pas être vide"),
    
    (req, res, next) => {
        const errors = validationResult(req); // Correction ici : passez 'req', pas 'req.body'
        if (!errors.isEmpty()) {
            const formated = errors.array().map(err => ({
                msg: err.msg,
                field: err.path
            }));
            
            return res
                .status(HTTP_STATUS.BAD_REQUEST.statusCode)
                .send(apiResponse(true, formated));
        } 
        next();
    }
];