import {prisma} from '../config.js';
import { Errors } from '../utils/errors.utils.js';
import {apiResponse} from '../utils/apiResponse.js';
const maintenanceTypeClient = prisma.maintenancetype;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createMaintenanceTypeService = async (body)=>{
    try {

        let {ref, name} = body

        if(ref){
            let exist = await maintenanceTypeClient.findFirst({where:{numRef:ref}})
            if(exist){
                return apiResponse(true, [{msg: "Ref number already exist", field: "numRef"}]);
            }
        }

        if(name){
            let exist = await maintenanceTypeClient.findFirst({where:{name}})
            if(exist){
                return apiResponse(true, [{msg: "Ref number already exist", field: "numRef"}]);
            }
        }

        const lastMaintenanceType = await maintenanceTypeClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastMaintenanceType ? parseInt(lastMaintenanceType.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        let type = await maintenanceTypeClient.create({
            data:{...body, numRef}
        });
        return apiResponse(false, undefined, type);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: `${error}`, field: "server"}]);
    }
}


/**
 * 
 * @returns 
 */
export const getAllMaintenanceTypeService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let maintenanceTypes = await maintenanceTypeClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                name: 'asc'
            }
        });
        const total = await maintenanceTypeClient.count({where:{isActive:true}});
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: maintenanceTypes,
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
export const getMaintenanceTypeByIdService = async(id) =>{
    try {
        let type = await maintenanceTypeClient.findFirst({
            where:{id, isActive: true},
        });
        return type;
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
export const getMaintenanceTypeByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search,  hasIncident, ...queries } = request; 
    const skip = (page - 1) * limit;
    const hasIncidentBoolean = hasIncident === 'true'
    try {
        let types = await maintenanceTypeClient.findMany({
            where:!search ? {...queries, hasIncident: hasIncidentBoolean} : {
                OR:[
                    {name:{contains:search}},
                    {numRef:{contains:search}}
                ],
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                name: 'asc'
            }
        });
        const total = await maintenanceTypeClient.count({where:{isActive:true}});
        return search ? {data: types} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: types,
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
export const updateMaintenanceTypeService = async (id, body) =>{
    try {
        let type = await maintenanceTypeClient.update({
            where:{id},
            data:body
        });
        return type;
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
export const deleteMaintenanceTypeService = async (id) =>{
    try {
        let type = await maintenanceTypeClient.update({
            where: {id},
            data:{isActive:false}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}