import {prisma} from '../config.js';
const supplierClient = prisma.supplier;

/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createSupplierService = async (body)=>{
    try {
        let supplier = await supplierClient.create({
            data:body
        });
        return supplier;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllSuppliersService = async(body) =>{
    try {
        let suppliers = await supplierClient.findMany({
            where:{isActive:true}
        });
        return suppliers;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`)
    }
}

/**
 * 
 * @param id 
 * @returns 
 */
export const getSupplierByIdService = async(id) =>{
    try {
        let supplier = await supplierClient.findFirst({
            where:{id, isActive: true},
        });
        return supplier;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

/**
 * 
 * @param request 
 * @returns 
 */
export const getSupplierByParams = async (request) =>{
    try {
        let supplier = await supplierClient.findMany({
            where:request
        });
        return supplier;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

/**
 * 
 * @param id 
 * @param body 
 * @returns 
 */
export const updateSupplierService = async (id, body) =>{
    try {
        let type = await supplierClient.update({
            where:{id},
            data:body
        });
        return type;
    } catch (error) {
        console.log(error)
        throw new Error(`${error}`);
    }
}

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteSupplierService = async (id) =>{
    try {
        let type = await supplierClient.delete({
            where: {id}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}