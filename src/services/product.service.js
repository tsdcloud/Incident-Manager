/**
 * This file contains the logic for product
 */

import {prisma} from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';
const productClient = prisma.product;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";
/**
 * Creates a new product
 * @param {*} body 
 * @returns product
 */
export const createProductService = async (body) =>{
    let {numRef, name} = body;
    if(numRef){
        let product = await productClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (product) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);;
    }

    if(name){
        let product = await productClient.findFirst({
            where:{name, isActive:true}
        })
        if (product) return apiResponse(true, [{msg: "Name already exist", field: "name"}]);;
    }

    const lastproduct = await productClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });    

    try {
        
        const numRef = generateRefNum(lastproduct);
        let product = await productClient.create({
            data:{...body, numRef}
        });

        return apiResponse(false, undefined, product);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: error, field:"server"}]);
    }
}



/**
 * Update an product
 * @param {*} id 
 * @param {*} body 
 * @returns updated product
 */
export const updateProductService = async(id, body)=>{
    try {
        let product = await productClient.update({
            where:{
                isActive:true, 
                id
            },
            data:body
        });

        return apiResponse(false, undefined, product);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}

/**
 * Returns the list of active families
 * @returns active families
 */
export const getAllProductsService = async () =>{
    try {
        let families = await productClient.findMany({
            where:{isActive:true}
        });
        return apiResponse(false, undefined, families);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}


export const getProductsByParamsService = async(params)=>{
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
        
        let families = await productClient.findMany({
            where: whereConditions,
            orderBy: {
                name: 'desc'
            }
        });

        const total = await productClient.count({
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
 * Get the product by Id
 * @param {*} id 
 * @returns product with id if active or Error
 */
export const getProductByIdService = async(id)=>{
    try {
        let product = await productClient.findUnique({
            where:{
                isActive:true,
                id
            }
        });

        if(!product) return apiResponse(true, [{msg:"Ce produit n'existe pas", field:"id"}]);
        return apiResponse(false, undefined, product);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:'server'}]);
    }
}


/**
 * Delete product
 * @param {*} id 
 * @returns an empty object
 */
export const deleteProductService = async (id) =>{
    try {
        // check if the product exist exist
        let productExist = await productClient.findUnique({
            where:{
                isActive:true, 
                id
            }
        });

        if(!productExist) return apiResponse(true, [{msg:"Ce produit d'equipement n'existe pas", field:"id"}]);
        // Update the name and active status if exist
        let product = await productClient.update({
            where:{id},
            data:{
                name:`deleted_${productExist.name}_${new Date().toTimeString()}`,
                isActive:false
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg:error, field:"server"}]);
    }
}