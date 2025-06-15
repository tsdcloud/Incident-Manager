import { createMaintenanceTypeService, deleteMaintenanceTypeService, getAllMaintenanceTypeService, getMaintenanceTypeByIdService, getMaintenanceTypeByParams, updateMaintenanceTypeService } from "../services/maintenanceType.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * Creates a new maintenance type
 * @param req 
 * @param res 
 * @returns - object of the created maintenance type
 */
export const createMaintenanceTypeController = async (req, res) => {
    try {
        let type = await createMaintenanceTypeService(req.body);
        res
        .status(type.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(type);
        return;
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{msg: `${error}`, field: "server"}]));
        return
    }
}

/**
 * Get a maintenance type by id
 * @param req
 * @param res 
 * @returns - object of the maintenance type
 */
export const getMaintenanceTypeByIdController = async (req, res) => {
    let { id } = req.params;
    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let type = await getMaintenanceTypeByIdService(id);
        res
        .send(type)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getAllMaintenanceTypeController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  types = await getMaintenanceTypeByParams(req.query);
            res
            .status(HTTP_STATUS.OK.statusCode)
            .send(types);
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }
    try {
        let types = await getAllMaintenanceTypeService(req.body);
        res
        .send(types)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
export const updateMaintenanceTypeController = async (req, res) => {
    try {
        let type = await updateMaintenanceTypeService(req.params.id, req.body);
        res
        .send(type)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
export const deleteMaintenanceTypeController = async (req, res) => {
    try {
        let type = await deleteMaintenanceTypeService(req.params.id);
        res
        .send(type)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
