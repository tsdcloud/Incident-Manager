import {prisma} from '../config.js';
const maintenanceClient = prisma.maintenance;


const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";


/**
 * Create a maintenance
 * @param body 
 * @returns 
 */
export const createMaintenanceService = async (body)=>{
    try {
        const lastMaintenance = await maintenanceClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastMaintenance ? parseInt(lastMaintenance.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
        let {maintenanceId, incidentId, equipement, ...data} = body
        let maintenance = await maintenanceClient.create({
            data:{
                ...data, 
                numRef,
                maintenance: { connect: { id: maintenanceId } },
                ...(incidentId ? { incident: { connect: { id: incidentId } } } : {}),
                equipement: { connect: { id: equipement } },
            }
        });
        return maintenance;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllMaintenanceService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let maintenance = await maintenanceClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            include:{
                incident:true,
                maintenance:true,
                incident:true,
                equipement:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await maintenanceClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: maintenance,
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
export const getMaintenanceByIdService = async(id) =>{
    try {
        let maintenance = await maintenanceClient.findFirst({
            where:{id, isActive: true},
        });
        return maintenance;
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
export const getMaintenanceByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let maintenances = await maintenanceClient.findMany({
            where:!search ? queries : {
                OR: [
                    {numRef: { contains: search }},
                    {name: { contains: search }}
                ],
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await maintenanceClient.count();
        return search ? {data: maintenances} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: maintenances,
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
export const updateMaintenanceService = async (id, body) =>{
    try {
        let date =  new Date();
        if(body?.status === "CLOSED"){
            body.closedDate = date;
            console.log(body, id);
        }
        let maintenance = await maintenanceClient.update({
            where:{id},
            data:body
        });
        console.log(maintenance);
        if(maintenance?.incidentId){
            await prisma.incident.update({
                where:{id: maintenance?.incidentId},
                data:{closedDate: date}
            });
        }
        return maintenance;
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
export const deleteMaintenanceService = async (id) =>{
    try {
        let maintenance = await maintenanceClient.update({
            where: {id},
            data:{
                isActive:false
            }
        });
        return maintenance
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}

export const generateExcelService = async (query) =>{
    let { start, end, value, criteria, condition } = query;
    try {
        let maintenance;

        if (condition === "NOT") {
            maintenance = await maintenanceClient.findMany({
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
                    maintenance:true
                }
            });
        } else {
            console.log(query)
            maintenance = await maintenanceClient.findMany({
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
                    maintenance:true
                }
            });
        }

        return maintenance;
    } catch (error) {
        throw new Error(error);
    }
}