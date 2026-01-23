import { createEquipementService, deleteEquipmentService, getAllEquipmentService, getEquipementByIdService, getEquipementByParams, getEquipementHistoryService, getSiteEquipmentsService, importEquipementService, updateEquipementService } from "../services/equipment.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createEquipementController = async (req, res) => {
    try {
        // Add validation for required fields
        // if (!req.body.name) {
        //     res.status(HTTP_STATUS.BAD_REQUEST.statusCode)
        //        .json({ error: "Name is required" });
        //     return;
        // }

        let equipement = await createEquipementService(req.body);

        res
        .status(equipement?.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .json(equipement);
        return;

    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .json({ error:true, error_list: [{msg:"Failed to create equipment", "path":"Internal server error"}] });
        return;
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
    if (!id) {
        res.status(HTTP_STATUS.NOT_FOUND.statusCode)
           .json({ error: "ID is required" });
        return;
    }

    try {
        let equipement = await getEquipementByIdService(id);
        if (!equipement) {
            res.status(HTTP_STATUS.NOT_FOUND.statusCode)
               .json({ error: "Equipment not found" });
            return;
        }
        res.status(HTTP_STATUS.OK.statusCode)
           .json(equipement);
        return;
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR.statusCode)
           .json({ error: "Failed to fetch equipment" });
        return;
    }
}


/**
 * Returns the equipement if any else returns an error
 * @param {*} req 
 * @param {*} res 
 */
export const getEquipementHistoryController= async (req, res) => {
    try {
        let {id, siteId} = req.params;

        let equipement = await getEquipementHistoryService(id, siteId);
        res
        .status(equipement.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(equipement);

    } catch (error) {
        console.log(error)
        res
        .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
        .send(apiResponse(true, [{message:`${error}`, field:'server'}]))
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
 * Get all the site equipments
 * @param {*} req 
 * @param {*} res 
 * @returns object
 */
// export const getSiteEquipmentsController = async (req, res)=>{
//     try {
//         let {siteId, search} = req.params;
//         let equipments = await getSiteEquipmentsService(siteId, search);
//         res
//         .status(equipments.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
//         .send(equipments);
//     } catch (error) {
//         console.log(error);
//         res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{message:`${error}`, field:"server"}]));
//         return 
//     }
// }
export const getSiteEquipmentsController = async (req, res) => {
    try {
        let { siteId } = req.params;
        let { search } = req.query; // Récupérer search depuis query params, pas depuis params
        
        let equipments = await getSiteEquipmentsService(siteId, search);
        res
        .status(equipments.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(equipments);
    } catch (error) {
        console.log(error);
        res.status(HTTP_STATUS.SERVEUR_ERROR.statusCode).send(apiResponse(true, [{message:`${error}`, field:"server"}]));
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
// export const updateEquipementController = async (req, res) => {
//     try {
//         let equipement = await updateEquipementService(req.params.id, req.body);
//         res
//         .send(equipement)
//         .status(HTTP_STATUS.OK.statusCode);
//         return;
//     } catch (error) {
//         console.log(error);
//         res
//         .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
//         return;
//     }
// }
export const updateEquipementController = async (req, res) => {
    try {
        const result = await updateEquipementService(req.params.id, req.body);

        // Si votre fonction Errors renvoie un format spécifique (ex: avec une propriété 'error')
        if (result && result.isError) { // Adaptez selon comment fonctionne votre fonction Errors()
            return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).send(result);
        }

        return res.status(HTTP_STATUS.OK.statusCode).send(result);
        
    } catch (error) {
        console.error(error);
        return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR.statusCode);
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
        if(equipement?.error){
            res
            .status(HTTP_STATUS.NOT_FOUND.statusCode)
            .send(equipement);
            return
        }
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


export const uploadEquipementController = async (req, res) =>{
    if (!req.file) {
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({ message: "No file uploaded" });
    }
    try {
        const filePath = req.file.path;
        await importEquipementService(filePath)
    } catch (error) {
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return
    }
}