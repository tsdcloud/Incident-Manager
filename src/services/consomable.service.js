import {prisma} from '../config.js';
import {consommableAbilities} from '../utils/abilities.utils.js';
const consommableClient = prisma.consommable;


const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create a consommable
 * @param body 
 * @returns 
 */
export const createConsommableService = async (body)=>{
    try {
        const lastConsommable = await consommableClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastConsommable ? parseInt(lastConsommable.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;

        let consommable = await consommableClient.create({
            data: { ...body, numRef }
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
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let consommables = await consommableClient.findMany({
            // where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await consommableClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: consommables,
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
export const getConsommableByIdService = async(id) =>{
    try {
        let consommable = await consommableClient.findFirst({
            where:{id, isActive: true},
        });
        if (!consommable) throw new Error(`No consommable found.`)
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
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let consommable = await consommableClient.findMany({
            where:!search ? queries : {
                name:{
                    contains:search
                },
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await consommableClient.count();
        return search ? {data: consommable} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: consommable,
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
        let consommable = await consommableClient.update({
            where: {id},
            data:{isActive:false}
        });
        // let consommable = await consommableClient.delete({
        //     where: {id}
        // });
        return consommable
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}