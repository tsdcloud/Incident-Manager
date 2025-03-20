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
        console.log(req.body)
        res
        .status(incidentCause?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
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
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  consommables = await getIncidentCauseByParams(req.query);
            res
            .send(consommables)
            .status(HTTP_STATUS.OK.statusCode);
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }

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
        let incidentCause = await deleteIncidentCauseService(req.params.id);
        res
        .status(incidentCause?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(incidentCause);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
