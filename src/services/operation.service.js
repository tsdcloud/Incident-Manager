import { prisma } from "../config.js";
import { apiResponse } from "../utils/apiResponse.js";
const operationClient = prisma.operation;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create operation
 * @param {*} body 
 */
export const createOperationService = async (body) =>{
    try {
        let {siteId, equipementId, actionTypeId, content} = body;
        // verify if equipement exist
        let equipementExist = await prisma.equipment.findFirst({
            where:{
                id:equipementId,
                isActive:true
            }
        });

        
        if(!equipementExist) return apiResponse(true, [{message:'equipement does not exist', field:'equipementId'}]);
        
        let operation = await operationClient.create({
            data:body
        });
        return apiResponse(false, undefined, operation);
    } catch (error) {
        console.log(error);
        return apiResponse(false,[{message:`${error}`, field:'server'}]);
    }
}


/**
 * Get all the operations
 * @returns 
 */
export const getAllOperationsService = async() =>{
    try {
        let operations = await operationClient.findMany({
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
        return apiResponse(false, undefined, operations);
    } catch (error) {
        console.log(error);
        return apiResponse(true,[{message:`${error}`, field:'server'}])
    }
}


/**
 * Get operation by id
 * @param {*} id 
 * @returns 
 */
export const getOperationByIdService = async(id)=>{
    try {
        let operation = await operationClient.findUnique({
            where:{
                isActive:true, 
                id
            },
            include:{
                equipement:true
            }
        });

        return apiResponse(false, undefined, operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}

/**
 * Get operations by params
 * @param {*} request 
 * @returns 
 */
export const getOperationsByParamsService=async(request)=>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let operations = await operationClient.findMany({
            where:!search ? queries : {
                OR:[
                    {content: {contains:search}},
                    {actionType: {contains:search}},
                    {description: {contains:search}},
                ],
                isActive:true
            },
            include:{
                equipement:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });

        const total = await operationClient.count({where:{isActive:true}});

        return search ? apiResponse(false, undefined, operations):{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: operations,
        };
    } catch (error) {
        console.log(error);
        apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Update the operation
 * @param {*} id 
 * @param {*} body 
 * @returns 
 */
export const updateOperationService=async(id, body)=>{
    try {
        // Check if the action type exist
        let actionExist = await operationClient.findUnique({
            where:{id, isActive:true}
        });
        if(!actionExist) return apiResponse(true, [{message:'action type does not exist', field:'id'}]);

        let operation = await operationClient.update({
            where:{
                id, isActive:true
            },
            data:body
        });
        return apiResponse(false, undefined, operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}])
    }
}


/**
 * Delete the action type
 * @param {*} id 
 * @returns 
 */
export const deleteOperationService = async(id) =>{
    try {
        let actionTypeExist = await operationClient.findUnique({
            where:{id, isActive:true}
        });
        if(!actionTypeExist) return apiResponse(true, [{message:'action type does not exist', field:'id'}]);

        let operation = await operationClient.update({
            where:{id, isActive:true},
            data:{
                name:`deleted_${actionTypeExist.name}_${new Date().toTimeString()}`
            }
        });

        return apiResponse(false, undefined,{});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}

/**
 * 
 * @param params
 * @returns
 */
// service.js - Service spécifique pour les opérations GE
export const generateExcelService = async (query) => {
    let { start, end, value, criteria, condition, equipementId } = query;

    console.log('Query parameters received:', { start, end, value, criteria, condition, equipementId });
    
    // Conversion des dates
    if(start && end){
        start = new Date(start);
        start.setHours(0, 0, 0, 0);
        start = start.toISOString();
    
        end = new Date(end);
        end.setHours(23, 59, 59, 999);
        end = end.toISOString();
    }
    
    try {
        let operations;
        
        // Si critère est "date"
        if(criteria === "date"){
            const dateCondition = condition === "NOT" 
                ? { not: { gte: start, lte: end } }
                : { gte: start, lte: end };

            operations = await operationClient.findMany({
                where: {
                    createdAt: dateCondition,
                    isActive: true,
                    // Si equipementId est fourni en plus de la date, on l'inclut
                    ...(equipementId ? { equipementId } : {})
                },
                include: {
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } 
        // Si critère est "equipementId"
        else if (criteria === "equipementId") {
            // CORRECTION: Gestion correcte de la valeur
            const equipValue = value || equipementId;
            const equipCondition = condition === "NOT" 
                ? { not: equipValue }
                : equipValue;

            operations = await operationClient.findMany({
                where: {
                    equipementId: equipCondition,
                    isActive: true,
                    // Si dates sont fournies en plus de l'équipement, on les inclut
                    ...((start && end) ? {
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                    } : {})
                },
                include: {
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }
        // Si aucun critère spécifié (toutes les opérations)
        else {
            operations = await operationClient.findMany({
                where: {
                    isActive: true,
                    // Filtres optionnels
                    ...((start && end) ? {
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                    } : {}),
                    ...(equipementId ? { equipementId } : {})
                },
                include: {
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        }

        console.log(`Found ${operations.length} operations`);
        return operations;
        
    } catch (error) {
        console.log("Error in generateExcelService:", error);
        throw new Error(`${error.message}`);
    }
}