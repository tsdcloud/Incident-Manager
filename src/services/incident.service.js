import { Prisma } from '@prisma/client';
import {prisma} from '../config.js';
import { generateRefNum } from '../utils/utils.js';
import { Errors } from '../utils/errors.utils.js';
const incidentClient = prisma.incident;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";


/**
 * Create an incident
 * @param body 
 * @returns 
 */
export const createIncidentService = async (body)=>{
    try {
        const lastIncident = await incidentClient.findFirst({
            where:{isActive:true},
            orderBy: { creationDate: 'desc'},
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncident ? parseInt(lastIncident.numRef.slice(-4)) + 1 : 1;
        const numRef = generateRefNum(lastIncident);
        let incident = await incidentClient.create({
            data:{ ...body, numRef }
        });

        return incident;
    } catch (error) {
        console.log(error)
        return (Errors(error.msg, "field"))
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let incidents = await incidentClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            include:{
                consommable:true,
                equipement:true,
                incidentCauses:true,
                incident:true,
            },
            orderBy:{
                creationDate:'desc'
            }
        });
        const total = await incidentClient.count({where:{isActive:true}});
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: incidents,
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
export const getIncidentByIdService = async(id) =>{
    try {
        let incident = await incidentClient.findFirst({
            where:{id, isActive: true},
        });
        return incident;
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
export const getIncidentByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let incidents = await incidentClient.findMany({
            where:!search ? {isActive:true, ...queries} : 
            {
                OR:[
                    {
                        numRef:{
                            contains:search
                        },
                        isActive:true
                    },
                    {
                        incident:{
                            name:{contains:search}
                        },
                        isActive:true
                    },
                    {
                        description:{
                            contains: search
                        },
                        isActive:true
                    }
                ]
            },
            include:{
                consommable:true,
                equipement:true,
                incidentCauses:true,
                incident:true,
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                creationDate:'desc'
            }
        });
        const total = await incidentClient.count({where:{isActive:true}});
        
        return search ? {data: incidents} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: incidents,
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
export const updateIncidentService = async (id, body) =>{
    try {
        let {createdBy, ...data} = body;
        let date =  new Date();
        if(body?.status === "CLOSED"){
            data.closedDate = date;
            data.closedBy = body.createdBy
        }
        console.log(data);
        let incident = await incidentClient.update({
            where:{id},
            data:{...data}
        });
        return incident;
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
export const deleteIncidentService = async (id) =>{
    try {
        let incident = await incidentClient.findFirst({where:{id}})
        let updateIncidnent = await incidentClient.update({
            where: {id},
            data:{
                isActive:false,
                numRef: `deleted__${incident.numRef}__${new Date().toISOString()}`
            }
        });
        return updateIncidnent
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
    
    if(start && end){
        start = new Date(start);
        start.setHours(0, 0, 0, 0);
        start = start.toISOString();
    
        end = new Date(end);
        end.setHours(23, 59, 59, 999);
        end = end.toISOString();
    }

    try {

        let incidents;

        if (condition === "NOT") {
            incidents = await incidentClient.findMany({
                where: {
                    [criteria]: {
                        not: value,
                    },
                    ...((start && end) ? {
                        creationDate: {
                            gte: start,
                            lte: end,
                        },
                    } : {}),
                    isActive:true
                },
                include:{
                    equipement:true,
                    incident:true,
                    maintenance:true,
                    incidentCauses:true
                }
            });
        } else {
            incidents = await incidentClient.findMany({
                where: {
                    [criteria]: value,
                    ...((start && end) ? {
                        creationDate: {
                            gte: start,
                            lte: end,
                        },
                    } : {}),
                    isActive:true
                },
                include:{
                    equipement:true,
                    incident:true,
                    maintenance:true,
                    incidentCauses:true
                }
            });
        }

        return incidents;
    } catch (error) {
        throw new Error(error);
    }
}