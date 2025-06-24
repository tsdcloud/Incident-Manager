import { createEquipmentGroupFamilyService, deleteEquipmentGroupFamilyService, getAllEquipmentGroupFamiliesService, getEquipmentGroupFamiliesByParamsService, getEquipmentGroupFamiliyByIdService, updateEquipmentGroupFamilyService } from "../services/equipmentGroupFamily.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createEquipmentGroupFamilyController = async (req, res) => {
    try {
        let family = await createEquipmentGroupFamilyService(req.body);
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
export const getEquipmentGroupFamilyByIdController = async (req, res) => {
    let { id } = req.params;

    if(!id){
        res
        .status(HTTP_STATUS.NOT_FOUND.statusCode)
        .send(apiResponse(true, [{msg:"La famille d'equipement n'existe pas", field:"id"}]))
        return;
    }

    try {
        let family = await getEquipmentGroupFamiliyByIdService(id);
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
export const getAllEquipmentGroupFamiliesController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  families = await getEquipmentGroupFamiliesByParamsService(req.query);
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
        let families = await getAllEquipmentGroupFamiliesService(req.body);
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
export const updateEquipmentGrupFamilyController = async (req, res) => {
    try {
        let family = await updateEquipmentGroupFamilyService(req.params.id, req.body);
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
export const deleteEquipementGroupFamilyController = async (req, res) => {
    try {
        let family = await deleteEquipmentGroupFamilyService(req.params.id);
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
