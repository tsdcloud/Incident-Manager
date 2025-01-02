import {prisma} from '../config.js';
const maintenance = prisma.maintenance;

/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createMaintenanceService = async (body)=>{
    try {
        let maintenance = await maintenance.create({
            data:body
        });
        return maintenance;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllMaintenanceService = async(body) =>{
    try {
        let maintenances = await maintenance.findMany({
            where:{isActive:true}
        });
        return maintenances;
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
export const getMaintenanceByIdService = async(id) =>{
    try {
        let maintenance = await maintenance.findFirst({
            where:{id, isActive: true},
        });
        return maintenance;
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
export const getMaintenanceByParams = async (request) =>{
    try {
        let maintenance = await maintenance.findMany({
            where:request
        });
        return maintenance;
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
export const updateMaintenanceService = async (id, body) =>{
    try {
        let maintenance = await maintenance.update({
            where:{id},
            data:body
        });
        return maintenance;
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
export const deleteMaintenanceService = async (id) =>{
    try {
        let maintenance = await maintenance.delete({
            where: {id}
        });
        return maintenance
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}