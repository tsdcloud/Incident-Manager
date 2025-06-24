import {prisma} from '../config.js';
import { Errors } from '../utils/errors.utils.js';
const incidentType = prisma.incidenttype;

const LIMIT = 100;
const ORDER ="desc";
const SORT_BY = "createdAt";

/**
 * Create an incident causes
 * @param body 
 * @returns 
 */
export const createIncidentTypeService = async (body)=>{
    try {
        
        if(body.numRef){
            let exist = await incidentType.findFirst({where:{numRef:body.numRef}});
            if(exist){
                return Errors("ref number already exist", "numRef");
            }
        }

        if(body.name){
            let exist = await incidentType.findFirst({where:{name:body.name}});
            if(exist){
                return Errors("Name already exist", "name");
            }
        }

        const lastIncidentType = await incidentType.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncidentType ? parseInt(lastIncidentType.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        let type = await incidentType.create({
            data:{...body, numRef}
        });
        return type;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentTypeService = async(body) =>{
    const page = 1; 
    const limit = LIMIT
    const skip = (page - 1) * limit;
    try {
        let types = await incidentType.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                name: 'asc'
            }
        });
        const total = await incidentType.count({where:{isActive:true}});
        return {
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
 * @returns 
 */
export const getIncidentTypeByIdService = async(id) =>{
    try {
        let type = await incidentType.findFirst({
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
export const getIncidentTypeByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let types = await incidentType.findMany({
            where:!search ? queries : {
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
        const total = await incidentType.count({where:{isActive:true}});
        return {
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
export const updateIncidentTypeService = async (id, body) =>{
    try {
        let type = await incidentType.update({
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
export const deleteIncidentTypeService = async (id) =>{
    try {
        let type = await incidentType.update({
            where: {id},
            data:{isActive:false}
        });
        return type
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}