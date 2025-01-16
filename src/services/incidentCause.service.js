import {prisma} from '../config.js';
const incidentCauses = prisma.incidentCause;

const LIMIT = 100;
const ORDER ="desc";
const SORT_BY = "createdAt";

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
    const page = 1; 
    const limit = LIMIT
    const skip = (page - 1) * limit;
    try {
        let causes = await incidentCauses.findMany({
            // where:queries,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt: 'desc'
            }
        });
        const total = await incidentCauses.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: causes,
        };
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
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
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let causes = await incidentCauses.findMany({
            where:queries,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt: ORDER
            }
        });
        const total = await incidentCauses.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: causes,
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