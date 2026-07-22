/**
 * This file contains the logic for  families
 */

import {prisma} from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';
const shipClient = prisma.ship;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";
/**
 * Creates a new 
 * @param {*} body 
 * @returns 
 */
export const createShipService = async (body) =>{
    let {numRef, name} = body;
    if(numRef){
        let ship = await shipClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (ship) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);;
    }

    if(name){
        let ship = await shipClient.findFirst({
            where:{name, isActive:true}
        })
        if (ship) return apiResponse(true, [{msg: "Name already exist", field: "name"}]);;
    }

    const lastship = await shipClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });    

    try {
        
        const numRef = generateRefNum(lastship);
        let ship = await shipClient.create({
            data:{...body, numRef}
        });

        return apiResponse(false, undefined, ship);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: error, field:"server"}]);
    }
}



/**
 * Update an  ship
 * @param {*} id 
 * @param {*} body 
 * @returns updated  ship
 */
export const updateShipService = async(id, body)=>{
    try {
        let ship = await shipClient.update({
            where:{
                isActive:true, 
                id
            },
            data:body
        });

        return apiResponse(false, undefined, ship);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}

/**
 * Returns the list of active  families
 * @returns active  families
 */
export const getAllShipsService = async () =>{
    try {
        let families = await shipClient.findMany({
            where:{isActive:true}
        });
        return apiResponse(false, undefined, families);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}


export const getShipsByParamsService = async(params)=>{
    try {
        const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = params; 
        
        // Construire les conditions WHERE
        let whereConditions = { isActive: true };
        
        // Ajouter la recherche par nom
        if (search) {
            whereConditions.name = {
                contains: search
            };
        }
        
        
        // Ajouter d'autres filtres s'ils existent
        if (Object.keys(queries).length > 0) {
            whereConditions = { ...whereConditions, ...queries };
        }
        
        let families = await shipClient.findMany({
            where: whereConditions,
            orderBy: {
                name: 'desc'
            }
        });

        const total = await shipClient.count({
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
 * Get the ship by Id
 * @param {*} id 
 * @returns ship with id if active or Error
 */
export const getShipByIdService = async(id)=>{
    try {
        let ship = await shipClient.findUnique({
            where:{
                isActive:true,
                id
            }
        });

        if(!ship) return apiResponse(true, [{msg:"Ce navire n'existe pas", field:"id"}]);
        return apiResponse(false, undefined, ship);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:'server'}]);
    }
}


/**
 * Delete ship
 * @param {*} id 
 * @returns an empty object
 */
export const deleteShipService = async (id) =>{
    try {
        // check if the  ship exist exist
        let shipExist = await shipClient.findUnique({
            where:{
                isActive:true, 
                id
            }
        });

        if(!shipExist) return apiResponse(true, [{msg:"Ce navire n'existe pas", field:"id"}]);
        // Update the name and active status if exist
        let ship = await shipClient.update({
            where:{id},
            data:{
                name:`deleted_${shipExist.name}_${new Date().toTimeString()}`,
                isActive:false
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}