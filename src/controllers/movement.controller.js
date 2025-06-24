import { createMovementService, deleteMovementService, getAllMovementsService, getMovementByIdService, getMovementsByParamsService, updateMovementService } from "../services/movement.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";



/**
 * Create movement controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createMovementController = async(req, res) =>{
    try {
        let body = req.body;

        let movement = await createMovementService(body);
        res
        .status(movement.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}



/**
 * Get all the movements
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getAllMovementsController = async(req, res)=>{
    try {
        if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
            try {
                let  movements = await getMovementsByParamsService(req.query);
                res
                .status(movements?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
                .send(movements);
                return;
            } catch (error) {
              console.log(error);
              res
              .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
              .send(apiResponse(true, [{message:`${error}`, field:'server'}]));
              return;
            }
        }
        let movements = await getAllMovementsService();
        res
        .status(movements.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(movements);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Get movement by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getMovementByIdController = async(req, res) =>{
    try {
        let {id} = req.params;
        let movement = await getMovementByIdService(id);
        res
        .status(movement.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Update movement
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updateMovementController = async(req, res)=>{
    try {
        let {id} = req.params;
        let body = req.body;
        let movement = await updateMovementService(id, body);
        res
        .status(movement.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Delete movement
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteMovementController = async(req, res) =>{
    try {
        let {id} = req.params;
        let movement = await deleteMovementService(id);
        res
        .status(movement.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.NO_CONTENT.statusCode)
        .send(movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}