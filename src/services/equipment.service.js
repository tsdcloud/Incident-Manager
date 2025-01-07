import {prisma} from '../config.js';
const equipementClient = prisma.equipement;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create qn equipement
 * @param body 
 * @returns 
 */
export const createEquipementService = async (body)=>{
    try {
        let equipement = await equipementClient.create({
            data:body
        });
        return equipement;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllEquipmentService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let equipements = await equipementClient.findMany({
            // where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await equipementClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: equipements,
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
export const getEquipementByIdService = async(id) =>{
    try {
        let equipement = await equipementClient.findFirst({
            where:{id, isActive: true},
        });
        return equipement;
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
export const getEquipementByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let equipement = await equipementClient.findMany({
            where:queries,
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await equipementClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: equipement,
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
export const updateEquipementService = async (id, body) =>{
    try {
        let equipement = await equipementClient.update({
            where:{id},
            data:body
        });
        return equipement;
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
export const deleteEquipmentService = async (id) =>{
    try {
        let equipement = await equipementClient.delete({
            where: {id}
        });
        return equipement
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}