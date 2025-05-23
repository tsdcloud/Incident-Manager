import {prisma} from '../config.js';
import {Errors} from '../utils/errors.utils.js';
const incidentCauses = prisma.incidentcause;

const LIMIT = 100;
const ORDER ="desc";
const SORT_BY = "createdAt";

/**
 * Create an incident causes
 * @param body 
 * @returns 
 */
export const createIncidentCauseService = async (body)=>{
    try {
        
        if(body.numRef){
            let exist = await incidentCauses.findFirst({where:{numRef:body.numRef}});
            if(exist) return Errors("Ref number already exits", "numRef")
        }

        if(body.name){
            let exist = await incidentCauses.findFirst({where:{name:body.name}});
            if(exist) return Errors("Name already exits", "name")
        }

        const lastIncidentCause = await incidentCauses.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncidentCause ? parseInt(lastIncidentCause.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        let cause = await incidentCauses.create({
            data:{...body, numRef}
        });
        return cause;
    } catch (error) {
        console.log(error);
        return Errors(true, error);
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentCauseService = async(body) =>{
    const page = 1; 
    const limit = LIMIT
    const skip = (page - 1) * limit;
    try {
        let causes = await incidentCauses.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                name: 'asc'
            }
        });
        const total = await incidentCauses.count({where:{isActive:true}});
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: causes,
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
export const getIncidentCauseByIdService = async(id) =>{
    try {
        let cause = await incidentCauses.findFirst({
            where:{id, isActive: true},
        });
        return cause;
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
export const getIncidentCauseByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    console.log(search);
    try {
        let causes = await incidentCauses.findMany({
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
        const total = await incidentCauses.count({where:{isActive:true}});
        return search ? {data: causes} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: causes,
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
export const updateIncidentCauseService = async (id, body) =>{
    try {
        let cause = await incidentCauses.update({
            where:{id},
            data:body
        });
        return cause;
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
export const deleteIncidentCauseService = async (id) =>{
    try {
        let exist = await incidentCauses.findFirst({where:{id}});
        if(!exist){
            return Errors("Incident cause does not exist", "id")
        }
        let cause = await incidentCauses.update({
            where: {id},
            data:{
                isActive:false,
                name:`deleted__${exist.name}__${new Date().toDateString()}`            }
        });
        return cause
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}