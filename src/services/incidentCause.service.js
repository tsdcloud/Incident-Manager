import {prisma} from '../config.js';
const incidentCauses = prisma.incidentCause;

/**
 * Create an incident causes
 * @param body 
 * @returns 
 */
export const createIncidentCauseService = async (body)=>{
    try {
        let cause = await incidentCauses.create({
            data:body
        });
        return cause;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentCauseService = async(body) =>{
    try {
        let causes = await incidentCauses.findMany({
            where:{isActive:true}
        });
        return causes;
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
export const getIncidentCauseByIdService = async(id) =>{
    try {
        let cause = await incidentCauses.findFirst({
            where:{id, isActive: true},
        });
        return cause;
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
export const getIncidentCauseByParams = async (request) =>{
    try {
        let cause = await incidentCauses.findMany({
            where:request
        });
        return cause;
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
export const updateIncidentCauseService = async (id, body) =>{
    try {
        let cause = await incidentCauses.update({
            where:{id},
            data:body
        });
        return cause;
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
export const deleteIncidentCauseService = async (id) =>{
    try {
        let cause = await incidentCauses.delete({
            where: {id}
        });
        return cause
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}