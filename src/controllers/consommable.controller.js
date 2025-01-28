import { createConsommableService, deleteConsommableServices, getAllConsommableService, getConsommableByIdService, getConsommableByParams, updateConsommableService } from "../services/consomable.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createConsommableController = async (req, res) => {
    try {
        let consommable = await createConsommableService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(consommable);
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
export const getConsommableByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let consommable = await getConsommableByIdService(id);
        res
        .send(consommable)
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
export const getAllConsommableController = async(req, res) => {
    
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  consommables = await getConsommableByParams(req.query);
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
        let consommables = await getAllConsommableService(req.body);
        res
        .send(consommables)
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
export const updateConsommableController = async (req, res) => {
    try {
        let consommable = await updateConsommableService(req.params.id, req.body);
        res
        .send(consommable)
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
export const deleteConsommableController = async (req, res) => {
    try {
        let consommable = await deleteConsommableServices(req.params.id);
        res
        .send(consommable)
        .status(HTTP_STATUS.NO_CONTENT.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
