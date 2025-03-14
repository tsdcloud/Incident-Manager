import { createIncidentTypeService, deleteIncidentTypeService, getAllIncidentTypeService, getIncidentTypeByIdService, getIncidentTypeByParams, updateIncidentTypeService } from "../services/incidentType.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createIncidentTypeController = async (req, res) => {
    try {
        let incidentType = await createIncidentTypeService(req.body);
        res
        .status(incidentType?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(incidentType);
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
export const getIncidentTypeByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let incidentType = await getIncidentTypeByIdService(id);
        res
        .send(incidentType)
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
export const getAllIncidentTypeController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  incidentTypes = await getIncidentTypeByParams(req.query);
            res
            .status(HTTP_STATUS.OK.statusCode)
            .send(incidentTypes)
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }
    try {
        let incidentTypes = await getAllIncidentTypeService(req.body);
        res
        .status(HTTP_STATUS.OK.statusCode)
        .send(incidentTypes)
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
export const updateIncidentTypeController = async (req, res) => {
    try {
        let incidentType = await updateIncidentTypeService(req.params.id, req.body);
        res
        .status(HTTP_STATUS.OK.statusCode)
        .send(incidentType)
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
export const deleteIncidentTypeController = async (req, res) => {
    try {
        let incidentType = await deleteIncidentTypeService(req.params.id);
        res
        .status(HTTP_STATUS.OK.statusCode)
        .send(incidentType)
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
