import {prisma} from '../config.js';
const incidentClient = prisma.incident;

/**
 * Create an incident
 * @param body 
 * @returns 
 */
export const createIncidentService = async (body)=>{
    try {
        let incident = await incidentClient.create({
            data:body
        });
        return incident;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentService = async(body) =>{
    try {
        let incident = await incidentClient.findMany({
            where:{isActive:true}
        });
        return incident;
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
export const getIncidentByIdService = async(id) =>{
    try {
        let incident = await incidentClient.findFirst({
            where:{id, isActive: true},
        });
        return incident;
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
export const getIncidentByParams = async (request) =>{
    try {
        let incident = await incidentClient.findMany({
            where:request
        });
        return incident;
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
export const updateIncidentService = async (id, body) =>{
    try {
        let incident = await incidentClient.update({
            where:{id},
            data:body
        });
        return incident;
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
export const deleteIncidentService = async (id) =>{
    try {
        let incident = await incidentClient.delete({
            where: {id}
        });
        return incident
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}