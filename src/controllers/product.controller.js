import { createProductService, deleteProductService, getAllProductsService, getProductsByParamsService, getProductByIdService, updateProductService } from "../services/product.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createProductController = async (req, res) => {
    try {
        let family = await createProductService(req.body);
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
export const getProductByIdController = async (req, res) => {
    let { id } = req.params;

    if(!id){
        res
        .status(HTTP_STATUS.NOT_FOUND.statusCode)
        .send(apiResponse(true, [{msg:"Le produit n'existe pas", field:"id"}]))
        return;
    }

    try {
        let family = await getProductByIdService(id);
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
export const getAllProductsController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let families = await getProductsByParamsService(req.query);
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
        let families = await getAllProductsService(); // ← Enlever req.body
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
export const updateProductController = async (req, res) => {
    try {
        let family = await updateProductService(req.params.id, req.body);
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
export const deleteProductController = async (req, res) => {
    try {
        let family = await deleteProductService(req.params.id);
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
