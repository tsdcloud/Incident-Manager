import {prisma} from '../config.js';
const maintenanceTypeClient = prisma.maintenanceType;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createMaintenanceTypeService = async (body)=>{
    try {
        let type = await maintenanceTypeClient.create({
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
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let maintenanceTypes = await maintenanceTypeClient.findMany({
            // where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await maintenanceTypeClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: maintenanceTypes,
        };
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
        let type = await maintenanceTypeClient.findFirst({
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
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let types = await maintenanceTypeClient.findMany({
            where:queries,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await maintenanceTypeClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: types,
        };
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
        let type = await maintenanceTypeClient.update({
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
        let type = await maintenanceTypeClient.delete({
            where: {id}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}