import { createIncidentCauseService, deleteIncidentCauseService, getAllIncidentCauseService, getIncidentCauseByIdService, getIncidentCauseByParams, updateIncidentCauseService } from "../services/incidentCause.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createIncidentCauseController = async (req, res) => {
    try {
        let incidentCause = await createIncidentCauseService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(incidentCause);
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
export const getIncidentCauseByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let incidentCause = await getIncidentCauseByIdService(id);
        res
        .send(incidentCause)
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
export const getAllIncidentCauseController = async(req, res) => {
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
        let incidentCauses = await getAllIncidentCauseService(req.body);
        res
        .send(incidentCauses)
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
export const updateIncidentCauseController = async (req, res) => {
    try {
        let incidentCause = await updateIncidentCauseService(req.params.id, req.body);
        res
        .send(incidentCause)
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
export const deleteIncidentCauseController = async (req, res) => {
    try {
        let incidentCause = await deleteIncidentCauseController(req.params.id);
        res
        .send(incidentCause)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
