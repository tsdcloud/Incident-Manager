import {prisma} from '../config.js';
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
            orderBy: { creationDate: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastIncident ? parseInt(lastIncident.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        let incident = await incidentClient.create({
            data:{ ...body, numRef }
        });
        return incident;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
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
        const total = await incidentClient.count();
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
            where:!search ? queries : 
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
                ]
            },
            include:{
                incident:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                creationDate:'desc'
            }
        });
        const total = await incidentClient.count();
        
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
        let date =  new Date();
        if(body?.status === "CLOSED"){
            body.closedDate = date;
        }
        let incident = await incidentClient.update({
            where:{id},
            data:body
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
        let incident = await incidentClient.delete({
            where: {id}
        });
        return incident
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
    try {
        let incidents;

        if (condition === "NOT") {
            incidents = await incidentClient.findMany({
                where: {
                    [criteria]: {
                        not: value,
                    },
                    ...(start && end ? {
                        creationDate: {
                            gte: start,
                            lte: end,
                        },
                    } : {}),
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
                    ...(start && end ? {
                        creationDate: {
                            gte: start,
                            lte: end,
                        },
                    } : {}),
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