import {prisma} from '../config.js';
const consommableClient = prisma.consommable;

/**
 * Create a consommable
 * @param body 
 * @returns 
 */
export const createConsommableService = async (body)=>{
    try {
        let consommable = await consommableClient.create({
            data:body
        });
        return consommable;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllConsommableService = async(body) =>{
    try {
        let consommables = await consommableClient.findMany({
            where:{isActive:true}
        });
        return consommables;
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
export const getConsommableByIdService = async(id) =>{
    try {
        let consommable = await consommableClient.findFirst({
            where:{id, isActive: true},
        });
        return consommable;
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
export const getConsommableByParams = async (request) =>{
    try {
        let consommable = await consommableClient.findMany({
            where:request
        });
        return consommable;
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
export const updateConsommableService = async (id, body) =>{
    try {
        let consommable = await consommableClient.update({
            where:{id},
            data:body
        });
        return consommable;
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
export const deleteConsommableServices = async (id) =>{
    try {
        let consommable = await consommableClient.delete({
            where: {id}
        });
        return consommable
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}