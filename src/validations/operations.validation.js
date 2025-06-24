import { body, validationResult } from "express-validator";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";

export const createOperationValidation = [
    // body("content").optional().notEmpty().withMessage('content should not be left empty'),
    body("siteId").notEmpty().isUUID().withMessage('invalid siteId'),
    body("actionType").notEmpty().isIn(['START', 'STOP', 'REFUEL']).withMessage('invalid actionType'),
    body("equipementId").notEmpty().withMessage('invaild equipementId'),
    (req, res, next)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, errors.array()))
            return
        }
        next();
    }
]

export const updateOperationValidation = [
    body("content").optional().notEmpty().withMessage('content should not be left empty'),
    body("siteId").optional().notEmpty().isUUID().withMessage('invalid siteId'),
    body("actionType").optional().notEmpty().isIn(['START', 'STOP', 'REFUEL']).withMessage('invalid actionType'),
    body("equipementId").optional().notEmpty().withMessage('invaild equipementId'),
    (req, res, next)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, errors.array()))
            return
        }
        next();
    }
]