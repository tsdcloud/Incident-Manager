import { prisma } from "../config.js";
import { apiResponse } from "../utils/apiResponse.js";
import { fetchData } from "../utils/fetch.utils.js";
const movementClient = prisma.movement;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create movement
 * @param {*} body 
 */
export const createMovementService = async (body) =>{
    try {
        let {originSite, equipementId, destinationSite} = body;
        // verify if equipement exist
        let equipementExist = await prisma.equipement.findFirst({
            where:{
                id:equipementId,
                isActive:true
            }
        });
        
        if(!equipementExist) return apiResponse(true, [{message:'equipement does not exist', field:'equipementId'}]);
        
        let movement = await movementClient.create({
            data:body
        });
        return apiResponse(false,undefined, movement);
    } catch (error) {
        console.log(error);
        return apiResponse(false,[{message:`${error}`, field:'server'}]);
    }
}


/**
 * Get all movements
 * @returns 
 */
export const getAllMovementsService = async() =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;
    try {
        let movements = await movementClient.findMany({
            where:{
                isActive:true
            },
            include:{
                equipement:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await movementClient.count({where:{isActive:true}});
        let data= {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: movements,
        };
        return apiResponse(false, undefined, data);
    } catch (error) {
        console.log(error);
        return apiResponse(true,[{message:`${error}`, field:'server'}])
    }
}


/**
 * Get movement by id
 * @param {*} id 
 * @returns 
 */
export const getMovementByIdService = async(id)=>{
    try {
        let movement = await movementClient.findUnique({
            where:{
                isActive:true, 
                id
            },
            include:{
                equipement:true
            }
        });

        return apiResponse(false, undefined, movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}

/**
 * Get movements by params
 * @param {*} request 
 * @returns 
 */
export const getMovementsByParamsService=async(request)=>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let movements = await movementClient.findMany({
            where:!search ? queries : {
                OR:[
                    {originSite: {contains:search}},
                    {destinationSite: {contains:search}},
                    {description: {contains:search}},
                    {equipement: {
                        name:{
                            contains:search
                        }
                    }},
                ],
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            include:{
                equipement:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });

        const total = await movementClient.count({where:{isActive:true}});

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: movements,
        }
        )
        // :{
        //     page: parseInt(page),
        //     totalPages: Math.ceil(total / limit),
        //     total,
        //     data: movements,
        // };
    } catch (error) {
        console.log(error);
        apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Update the movement
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const updateMovementService=async(id, body)=>{
    try {
        
        let movement = await movementClient.update({
            where:{
                id, isActive:true
            },
            data:body
        });
        return apiResponse(false, undefined, movement);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}])
    }
}


/**
 * Delete the movement
 * @param {*} id 
 * @returns 
 */
export const deleteMovementService = async(id) =>{
    try {
        let movementExist = await movementClient.findUnique({
            where:{id, isActive:true}
        });
        if(!movementExist) return apiResponse(true, [{message:'Movement does not exist', field:'id'}]);

        let operation = await movementClient.update({
            where:{id, isActive:true},
            data:{
                name:`deleted_${movementExist.name}_${new Date().toTimeString()}`
            }
        });

        return apiResponse(false, undefined,{});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}