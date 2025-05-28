import { createOperationService, getAllOperationsService, getOperationByIdService, getOperationsByParamsService, updateOperationService, deleteOperationService } from "../services/operation.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";



/**
 * Create operation controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createOperationController = async(req, res) =>{
    try {
        let body = req.body;

        let actionType = await createOperationService(body);
        res
        .status(actionType.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(actionType);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}



/**
 * Get all the operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getAllOperationController = async(req, res)=>{
    try {
        if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
            try {
                let  operation = await getOperationsByParamsService(req.query);
                res
                .status(operation.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
                .send(operation);
                return;
            } catch (error) {
              console.log(error);
              res
              .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
              .send(apiResponse(true, [{message:`${error}`, field:'server'}]));
              return;
            }
        }
        let operation = await getAllOperationsService();
        res
        .status(operation.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Get operation by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getOperationByIdController = async(req, res) =>{
    try {
        let {id} = req.params;
        let operation = await getOperationByIdService(id);
        res
        .status(operation.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Update operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updateOperationController = async(req, res)=>{
    try {
        let {id} = req.params;
        let body = req.body;
        let operation = await updateOperationService(id, body);
        res
        .status(operation.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Delete operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteOperationController = async(req, res) =>{
    try {
        let {id} = req.params;
        let actionType = await deleteOperationService(id);
        res
        .status(actionType.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.NO_CONTENT.statusCode)
        .send(actionType);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}