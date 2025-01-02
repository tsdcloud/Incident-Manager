import { createSupplierService, deleteSupplierService, getAllSuppliersService, getSupplierByIdService, getSupplierByParams, updateSupplierService } from "../services/supplier.service.js";
import HTTP_STATUS from "../utils/http.utils.js";


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createSupplierController = async (req, res) => {
    try {
        let supplier = await createSupplierService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(supplier);
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
export const getSupplierByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let supplier = await getSupplierByIdService(id);
        res
        .send(supplier)
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
export const getAllSuppliersController = async(req, res) => {
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
        let suppliers = await getAllSuppliersService(req.body);
        res
        .send(suppliers)
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
export const updateSupplierController = async (req, res) => {
    try {
        let supplier = await updateSupplierService(req.params.id, req.body);
        res
        .send(supplier)
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
export const deleteSupplierController = async (req, res) => {
    try {
        let supplier = await deleteSupplierService(req.params.id);
        res
        .send(supplier)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}
