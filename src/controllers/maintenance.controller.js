import { createMaintenanceService, deleteMaintenanceService, getAllMaintenanceService, getMaintenanceByIdService, getMaintenanceByParams, updateMaintenanceService } from "../services/maintenance.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createMaintenanceController = async (req, res) => {
    try {
        let maintenance = await createMaintenanceService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(maintenance);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return
    }
}

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const getMaintenanceByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let maintenance = await getMaintenanceByIdService(id);
        res
        .send(maintenance)
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
export const getAllMaintenanceController = async(req, res) => {
    console.log(req.query);
    // if(req.query){
    //     try {
    //         let  budget = await getBudgetByParams(req.query);
    //         res
    //         .send(budget)
    //         .status(HTTP_STATUS.OK.statusCode);
    //         return;
    //     } catch (error) {
    //       console.log(error);
    //       res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
    //       return;
    //     }
    // }
    try {
        let maintenances = await getAllMaintenanceService(req.body);
        res
        .send(maintenances)
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
export const updateMaintenanceController = async (req, res) => {
    try {
        let maintenance = await updateMaintenanceService(req.params.id, req.body);
        res
        .send(maintenance)
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
export const deleteMaintenanceController = async (req, res) => {
    try {
        let maintenance = await deleteMaintenanceService(req.params.id);
        res
        .send(maintenance)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
