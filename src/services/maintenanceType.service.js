import {prisma} from '../config.js';
const maintenanceType = prisma.maintenanceType;

/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createMaintenanceTypeService = async (body)=>{
    try {
        let type = await maintenanceType.create({
            data:body
        });
        return type;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllMaintenanceTypeService = async(body) =>{
    try {
        let types = await maintenanceType.findMany({
            where:{isActive:true}
        });
        return types;
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
export const getMaintenanceTypeByIdService = async(id) =>{
    try {
        let type = await maintenanceType.findFirst({
            where:{id, isActive: true},
        });
        return type;
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
export const getMaintenanceTypeByParams = async (request) =>{
    try {
        let type = await maintenanceType.findMany({
            where:request
        });
        return type;
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
export const updateMaintenanceTypeService = async (id, body) =>{
    try {
        let type = await maintenanceType.update({
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
export const deleteMaintenanceTypeService = async (id) =>{
    try {
        let type = await maintenanceType.delete({
            where: {id}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}