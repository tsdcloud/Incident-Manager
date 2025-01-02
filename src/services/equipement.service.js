import {prisma} from '../config.js';
const equipementClient = prisma.equipement;

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
    try {
        let equipement = await equipementClient.findMany({
            where:{isActive:true}
        });
        return equipement;
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
    try {
        let equipement = await equipementClient.findMany({
            where:request
        });
        return equipement;
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