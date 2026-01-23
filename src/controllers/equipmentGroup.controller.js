import { createEquipmentGroupService, deleteEquipmentGroupService, getAllEquipmentGroupsService, getEquipmentGroupByParamsService, updateEquipmentGroupService } from "../services/equipmentGroup.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * Create the equipment group
 * @param {*} req 
 * @param {*} res 
 * @returns the created group
 */
export const createEquipmentGroupController = async(req, res)=>{
    try {
        let {body} = req;
        let group = await createEquipmentGroupService(body);
        return res.status(group.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode).send(group);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}

/**
 * Get the equipment group by id
 * @param {*} req 
 * @param {*} res 
 * @returns equipment group by id
 */
export const getEquipmentByIdController = async (req, res) =>{
    try {
        let {id} = req.params

        if(!id) return apiResponse(true, [{msg:"Id n'est pas fourni", field:"id"}]);

        let group = await getAllEquipmentGroupsService(id);

        return res.status(group.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode).send(group);

    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:'server'}]);
    }
}


/**
 * Get the all the equipments
 * @param {*} req 
 * @param {*} res 
 * @returns all the active groups
 */
export const getAllEquipmentGroupsController = async (req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  groups = await getEquipmentGroupByParamsService(req.query);
            res
            .status(groups.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
            .send(groups)
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
        let groups = await getAllEquipmentGroupsService();
        return res.status(groups.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode).send(groups);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}



/**
 * Update the equipment groups
 * @param {*} req 
 * @param {*} res 
 * @returns updated equipment group
 */
export const updateEquipmentGroupController = async (req, res) => {
    try {
        let { body } = req;
        let { id } = req.params;

        console.log("Requête PATCH reçue:");
        console.log("ID:", id);
        console.log("Body:", body);

        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
                .send(apiResponse(true, [{ msg: "Id n'est pas fournie", field: "id" }]));
        }
        
        let group = await updateEquipmentGroupService(id, body);
        
        // CORRECTION : Renvoyer la réponse
        return res.status(group.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
                  .send(group);
                  
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.statusCode)
                  .send(apiResponse(true, [{ msg: error.message || "Erreur serveur", field: "server" }]));
    }
};


/**
 * Delete the equipment group
 * @param {*} req 
 * @param {*} res 
 * @returns empty object
 */
export const deleteEquipmentGroupController = async(req, res)=>{
    try {
        let {id} = req.params;
        let group = await deleteEquipmentGroupService(id);
        return res.status(group.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.NO_CONTENT.statusCode);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}