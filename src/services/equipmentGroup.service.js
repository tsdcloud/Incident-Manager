/**
 * This file contains the logic for equipment group
 */

import {prisma} from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';
const equipmentGroupClient = prisma.equipmentgroup;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";
/**
 * Creates a new equipment group
 * @param {*} body 
 * @returns equipment group
 */
export const createEquipmentGroupService = async (body) =>{
    let {numRef, name, equipmentGroupFamilyId} = body;
    if(numRef){
        let equipmentGroup = await equipmentGroupClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (equipmentGroup) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);
    }

    if(name){
        let equipmentGroup = await equipmentGroupClient.findFirst({
            where:{name, isActive:true}
        })
        if (equipmentGroup) return apiResponse(true, [{msg: "Name already exist", field: "name"}]);
    }

    // Check if the family exist
    let familyExist = await prisma.equipmentGroupFamily.findFirst({
        where:{
            id: equipmentGroupFamilyId,
            isActive:true
        }
    });

    if(!familyExist) return apiResponse(true, [{msg: "Famille d'equipement n'existe pas", field: "equipmentGroupFamilyId"}]);

    const lastEquipmentGroup = await equipmentGroupClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });    

    try {
        
        const numRef = generateRefNum(lastEquipmentGroup);
        let group = await equipmentGroupClient.create({
            data:{...body, numRef}
        });

        return apiResponse(false, undefined, group);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: error, field:"server"}]);
    }
}



/**
 * Update an equipment group
 * @param {*} id 
 * @param {*} body 
 * @returns updated equipment group
 */
export const updateEquipmentGroupService = async(id, body)=>{
    try {
        let group = await equipmentGroupClient.update({
            where:{
                isActive:true, 
                id
            },
            data:body
        });

        return apiResponse(false, undefined, group);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}

/**
 * Returns the list of active equipments
 * @returns active equipment groups
 */
export const getAllEquipmentGroupsService = async () =>{
    try {
        let groups = await equipmentGroupClient.findMany({
            where:{isActive:true},
            include:{
                equipmentGroupFamily:true
            },
        });
        return apiResponse(false, undefined, groups);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}


/**
 * Returns equipments based on the params
 * @param {*} params 
 * @returns list of active equipment groups based on params
 */
export const getEquipmentGroupByParamsService = async(params)=>{
    try {
        const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = params; 
        
        let groups = await equipmentGroupClient.findMany({
            where:!search ? queries : {
                name:{
                    contains:search
                },
                isActive:true
            },
            include:{
                equipmentGroupFamily:true
            },
            orderBy:{
                name:'desc'
            }
        });

        const total = await equipmentGroupClient.count({where:{isActive:true}});

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: groups,
        });
        
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}



/**
 * Get the group by Id
 * @param {*} id 
 * @returns group with id if active or Error
 */
export const getEquipmentByIdService = async(id)=>{
    try {
        let group = await equipmentGroupClient.findUnique({
            where:{
                isActive:true,
                id
            }
        });

        if(!group) return apiResponse(true, [{msg:"Le group n'existe pas", field:"id"}]);
        return apiResponse(false, undefined, group);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:'server'}]);
    }
}


/**
 * Delete equipment group
 * @param {*} id 
 * @returns an empty object
 */
export const deleteEquipmentGroupService = async (id) =>{
    try {
        // check if the equipment exist
        let groupExist = await equipmentGroupClient.findUnique({
            where:{
                isActive:true, 
                id
            }
        });

        if(!groupExist) return apiResponse(true, [{msg:"Le group d'equipement n'existe pas", field:"id"}]);
        // Update the name and active status if exist
        let group = await equipmentGroupClient.update({
            where:{id},
            data:{
                name:`deleted_${groupExist.name}_${new Date().toTimeString()}`,
                isActive:false
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}