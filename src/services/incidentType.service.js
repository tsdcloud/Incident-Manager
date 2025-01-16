import {prisma} from '../config.js';
const incidentType = prisma.incidentType;

const LIMIT = 100;
const ORDER ="desc";
const SORT_BY = "createdAt";

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
    const page = 1; 
    const limit = LIMIT
    const skip = (page - 1) * limit;
    try {
        let types = await incidentType.findMany({
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt: 'desc'
            }
        });
        const total = await incidentType.count();
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
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let types = await incidentType.findMany({
            where:queries,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt: ORDER
            }
        });
        const total = await incidentType.count();
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