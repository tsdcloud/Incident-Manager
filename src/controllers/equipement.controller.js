import { createEquipementService, deleteEquipmentService, getAllEquipmentService, getEquipementByIdService, getEquipementByParams, updateEquipementService } from "../services/equipment.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createEquipementController = async (req, res) => {
    try {
        let consommable = await createEquipementService(req.body);
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
export const getEquipementByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let equipement = await getConsommableByIdService(id);
        res
        .send(equipement)
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
export const getAllEquipementController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  consommables = await getEquipementByParams(req.query);
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
        let equipments = await getAllEquipmentService(req.body);
        res
        .send(equipments)
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
export const updateEquipementController = async (req, res) => {
    try {
        let equipement = await updateEquipementService(req.params.id, req.body);
        res
        .send(equipement)
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
export const deleteEquipementController = async (req, res) => {
    try {
        let equipement = await deleteEquipmentService(req.params.id);
        res
        .send(equipement)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
