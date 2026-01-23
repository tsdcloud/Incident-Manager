/**
 * This file contains the logic for equipment group families
 */

import {prisma} from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';
const equipmentGroupFamilyClient = prisma.equipmentGroupFamily;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";
/**
 * Creates a new equipment group
 * @param {*} body 
 * @returns equipment group
 */
export const createEquipmentGroupFamilyService = async (body) =>{
    let {numRef, name} = body;
    if(numRef){
        let equipmentGroupFamily = await equipmentGroupFamilyClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (equipmentGroupFamily) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);;
    }

    if(name){
        let equipmentGroupFamily = await equipmentGroupFamilyClient.findFirst({
            where:{name, isActive:true}
        })
        if (equipmentGroupFamily) return apiResponse(true, [{msg: "Name already exist", field: "name"}]);;
    }

    const lastEquipmentGroupFamily = await equipmentGroupFamilyClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });    

    try {
        
        const numRef = generateRefNum(lastEquipmentGroupFamily);
        let family = await equipmentGroupFamilyClient.create({
            data:{...body, numRef}
        });

        return apiResponse(false, undefined, family);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: error, field:"server"}]);
    }
}



/**
 * Update an equipment group family
 * @param {*} id 
 * @param {*} body 
 * @returns updated equipment group family
 */
export const updateEquipmentGroupFamilyService = async(id, body)=>{
    try {
        let family = await equipmentGroupFamilyClient.update({
            where:{
                isActive:true, 
                id
            },
            data:body
        });

        return apiResponse(false, undefined, family);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}

/**
 * Returns the list of active equipment group families
 * @returns active equipment group families
 */
export const getAllEquipmentGroupFamiliesService = async () =>{
    try {
        let families = await equipmentGroupFamilyClient.findMany({
            where:{isActive:true}
        });
        return apiResponse(false, undefined, families);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}


/**
 * Returns equipment group families based on the params
 * @param {*} params 
 * @returns list of active equipment group families based on params
 */
// export const getEquipmentGroupFamiliesByParamsService = async(params)=>{
//     try {
//         const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = params; 
        
//         let families = await equipmentGroupFamilyClient.findMany({
//             where:!search ? {...queries, isActive:true} : {
//                 name:{
//                     contains:search
//                 },
//                 isActive:true
//             },
//             orderBy:{
//                 name:'desc'
//             }
//         });

//         const total = await equipmentGroupFamilyClient.count({where:{isActive:true}});

//         return apiResponse(false, undefined, {
//             page: parseInt(page),
//             totalPages: Math.ceil(total / LIMIT),
//             total,
//             data: families,
//         });
        
//     } catch (error) {
//         console.log(error);
//         return apiResponse(true, [{msg:error, field:"server"}]);
//     }
// }
export const getEquipmentGroupFamiliesByParamsService = async(params)=>{
    try {
        const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, domain, ...queries } = params; 
        
        // Construire les conditions WHERE
        let whereConditions = { isActive: true };
        
        // Ajouter la recherche par nom
        if (search) {
            whereConditions.name = {
                contains: search
            };
        }
        
        // Ajouter le filtre par domaine si spécifié
        if (domain && domain !== "ALL") {
            whereConditions.domain = domain;
        }
        
        // Ajouter d'autres filtres s'ils existent
        if (Object.keys(queries).length > 0) {
            whereConditions = { ...whereConditions, ...queries };
        }
        
        let families = await equipmentGroupFamilyClient.findMany({
            where: whereConditions,
            orderBy: {
                name: 'desc'
            }
        });

        const total = await equipmentGroupFamilyClient.count({
            where: whereConditions
        });

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: families,
        });
        
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}



/**
 * Get the family by Id
 * @param {*} id 
 * @returns family with id if active or Error
 */
export const getEquipmentGroupFamiliyByIdService = async(id)=>{
    try {
        let family = await equipmentGroupFamilyClient.findUnique({
            where:{
                isActive:true,
                id
            }
        });

        if(!family) return apiResponse(true, [{msg:"La famille n'existe pas", field:"id"}]);
        return apiResponse(false, undefined, family);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:'server'}]);
    }
}


/**
 * Delete equipment group family
 * @param {*} id 
 * @returns an empty object
 */
export const deleteEquipmentGroupFamilyService = async (id) =>{
    try {
        // check if the equipment group family exist exist
        let familyExist = await equipmentGroupFamilyClient.findUnique({
            where:{
                isActive:true, 
                id
            }
        });

        if(!familyExist) return apiResponse(true, [{msg:"La famille d'equipement n'existe pas", field:"id"}]);
        // Update the name and active status if exist
        let family = await equipmentGroupFamilyClient.update({
            where:{id},
            data:{
                name:`deleted_${familyExist.name}_${new Date().toTimeString()}`,
                isActive:false
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}