import {prisma} from '../config.js';
const incidentType = prisma.incidentType;

/**
 * Create an incident causes
 * @param body 
 * @returns 
 */
export const createIncidentTypeService = async (body)=>{
    try {
        let type = await incidentType.create({
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
export const getAllIncidentTypeService = async(body) =>{
    try {
        let types = await incidentType.findMany({
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
export const getIncidentTypeByIdService = async(id) =>{
    try {
        let type = await incidentType.findFirst({
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
export const getIncidentTypeByParams = async (request) =>{
    try {
        let type = await incidentType.findMany({
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
export const updateIncidentTypeService = async (id, body) =>{
    try {
        let type = await incidentType.update({
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
export const deleteIncidentTypeService = async (id) =>{
    try {
        let type = await incidentType.delete({
            where: {id}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}