import { createShipService, deleteShipService, getAllShipsService, getShipsByParamsService, getShipByIdService, updateShipService } from "../services/ship.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createShipController = async (req, res) => {
    try {
        let family = await createShipService(req.body);
        res
        .status(family?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(family);
        return;
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
        return
    }
}

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const getShipByIdController = async (req, res) => {
    let { id } = req.params;

    if(!id){
        res
        .status(HTTP_STATUS.NOT_FOUND.statusCode)
        .send(apiResponse(true, [{msg:"Le produit n'existe pas", field:"id"}]))
        return;
    }

    try {
        let family = await getShipByIdService(id);
        res
        .status(family?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(family);
        return;
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getAllShipsController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let families = await getShipsByParamsService(req.query);
            res
            .status(families.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
            .send(families)
            return;
        } catch (error) {
            console.log(error);
            res
            .status(HTTP_STATUS.BAD_REQUEST.statusCode)
            .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
            return;
        }
    }
    
    try {
        // CORRECTION : Ne pas passer req.body ici
        let families = await getAllShipsService(); // ← Enlever req.body
        res
        .status(families.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(families);
        return;
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
        return;
    }
}

/**
 * 
 * @param req 
 * @param res 
 */
export const updateShipController = async (req, res) => {
    try {
        let family = await updateShipService(req.params.id, req.body);
        res
        .status(family.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(family)
        return;
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
export const deleteShipController = async (req, res) => {
    try {
        let family = await deleteShipService(req.params.id);
        res
        .status(family.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(family)
        return;
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send(apiResponse(true, [{msg: `${error}`, field:"server"}]));
        return;
    }
}
