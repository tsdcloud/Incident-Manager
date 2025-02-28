import {prisma} from '../config.js';
import { generateRefNum } from '../utils/utils.js';
const offBridgeClient = prisma.offBridge;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";


/**
 * Create an incident
 * @param body 
 * @returns 
 */
export const createOffBridgeService = async (body)=>{
    try {
        const lastOffBridge = await offBridgeClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        let nextNum = lastOffBridge ? parseInt(lastOffBridge.numRef.slice(-4)) + 1 : 1;
        let numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;

        // Check for uniqueness of numRef
        while (await offBridgeClient.findFirst({ where: { numRef } })) {
            nextNum += 1;
            numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        }
        
        let offBridge = await offBridgeClient.create({
            data:{
                ...body, 
                numRef
            }
        });
        return offBridge;
        // return
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllOffBridgeService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let offBridges = await offBridgeClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            include:{
                incidentCauses:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await offBridgeClient.count({where:{isActive:true}});
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: offBridges,
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
export const getOffBridgeByIdService = async(id) =>{
    try {
        let offBridge = await offBridgeClient.findFirst({
            where:{id, isActive: true},
        });
        return offBridge;
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
export const getOffBridgeByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let offBridges = await offBridgeClient.findMany({
            where:!search ? queries : {
                OR: [
                    {numRef: { contains: search }},
                ],
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await offBridgeClient.count({where:{isActive:true}});
        return search ? {data: offBridges} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: offBridges,
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
export const updateOffBridgeService = async (id, body) =>{
    try {
        let date =  new Date();
        if(body?.status === "CLOSED"){
            body.closedDate = date;
        }
        let offBridge = await offBridgeClient.update({
            where:{id},
            data:body
        });
        return offBridge;
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
export const deleteOffBridgeService = async (id) =>{
    try {
        let offBridge = await offBridgeClient.delete({
            where: {id}
        });
        return offBridge
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @param params
 * @returns
 */
export const generateExcelService = async (query) => {
    let { start, end, value, criteria, condition } = query;
    try {
        let offBridges;

        if (condition === "NOT") {
            offBridges = await offBridgeClient.findMany({
                where: {
                    [criteria]: {
                        not: value,
                    },
                    ...(start && end ? {
                        createdAt: {
                            gte: start,
                        },
                        createdAt: {
                            lte: end,
                        },
                    } : {}),
                },
                include:{
                    incidentCauses:true
                }
            });
        } else {
            offBridges = await offBridgeClient.findMany({
                where: {
                    [criteria]: value,
                    ...(start && end ? {
                        createdAt: {
                            gte: start,
                        },
                        createdAt: {
                            lte: end,
                        },
                    } : {}),
                },
                include:{
                    incidentCauses:true
                }
            });
        }

        return offBridges;
    } catch (error) {
        throw new Error(error);
    }
}