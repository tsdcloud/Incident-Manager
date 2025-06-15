import {prisma} from '../config.js';
import { Errors } from '../utils/errors.utils.js';
import { handleExternalFetch } from '../utils/employees.utils.js';
import { getCachedData, setCachedData } from '../utils/cache.utils.js';
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
        let {incidentId, equipementId, ...data} = body
        console.log(body)

        if(incidentId){
            let incidentExist = await prisma.incident.findFirst({where:{id: incidentId}});
            if(!incidentExist) return Errors("L'incident n'exist pas");
        }
        // let maintenanceTypeExist = await prisma.maintenancetype.findFirst({where:{id: maintenanceId}});
        // if(!maintenanceTypeExist) return Errors("Le type de maintenance n'exist pas");

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
        let maintenance = await maintenanceClient.create({
            data:{
                ...data, 
                numRef,
                // maintenance: { connect: { id: maintenanceId } },
                ...(incidentId ? { incident: { connect: { id: incidentId} } } : {}),
                equipement: { connect: { id: equipementId } },
            }
        });

        if (data.maintenance === 'PROGRAMMED') {
            await prisma.equipment.update({
                where: { id: equipementId },
                data: {
                    lastMaintenance: date
                }
            });
        }

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
                incident:true,
                equipement:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await maintenanceClient.count({where:{isActive:true}});
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
export const getMaintenanceByParams = async (request, token) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, filter, value, ...queries } = request; 
    const skip = (page - 1) * limit;
    let maintenances = []
    let total = 0

    if(filter && value){
        maintenances = await handleFilteredSearch(filter, value, maintenances, token);
    }else{
        try {
            maintenances = await maintenanceClient.findMany({
                where:!search ? {isActive:true, ...queries} : {
                    OR: [
                        {numRef: { contains: search }},
                        {incident:{
                            numRef:{
                                contains: search
                            },
                            isActive:true
                        }}
                    ]
                },
                include:{
                    incident:true,
                    equipement:true
                },
                orderBy:{
                    createdAt:'desc'
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                orderBy:{
                    createdAt:'desc'
                }
            });
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`);
        }
    }
    total = maintenances?.length;
        return search ? {data: maintenances} :{
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: maintenances,
        };
}


/**
 * 
 * @param id 
 * @param body 
 * @returns 
 */
export const updateMaintenanceService = async (id, body) =>{
    try {
        let { status } = body;
        let date =  new Date().toISOString();
        if(status === "CLOSED"){
            body.closedDate = date;
            body.closedBy = body["updatedBy"];
        }

        let maintenance = await maintenanceClient.update({
            where:{id},
            data:body
        });

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
 * Delete a maintenance
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


/**
 * Close a maintenance
 * @param {*} query 
 * @returns 
 */
export const closeMaintenanceService = async (id, body)=>{
    let {supplierId, incidentCauseId, incidentId, validationBy} = body;
    let date =  new Date().toISOString();
    
    let incidentCauseExist = await prisma.incidentcause.findFirst({where:{id: incidentCauseId}});
    if(!incidentCauseExist) return Errors("La cause d'incident sélectionné n'exist pas");
    
    try {
        let data = await prisma.$transaction([
            prisma.incident.update({
                where:{id: incidentId}, 
                data:{
                    incidentCauseId,
                    status: 'CLOSED',
                    closedBy:validationBy,
                    closedDate:date,
                }
            }),
            prisma.maintenance.update({
                where:{id},
                data:{
                    status: "CLOSED",
                    supplierId,
                    closedDate:date,
                    closedBy:validationBy
                }
            })
        ]);
        
        if(!data) throw new Error();
    } catch (error) {
        console.log(error);
        return {"error":true, errors:[{msg:"N'a pas pu être validé, essayez plus tard"}]};
    }
}


/**
 * Generate extractions
 * @param {*} query 
 * @returns 
 */
export const generateExcelService = async (query) =>{

    let { start, end, value, criteria, condition } = query;

    if(start && end){
        start = new Date(start);
        start.setHours(0, 0, 0, 0);
        start = start.toISOString();
    
        end = new Date(end);
        end.setHours(23, 59, 59, 999);
        end = end.toISOString();
    }

    if(criteria === "date"){
        try {
            let maintenances;

            if (condition === "NOT") {
                maintenances = await maintenanceClient.findMany({
                    where: {
                        createdAt: {
                            not:{
                                gte: start,
                                lte: end,
                            }
                        },
                        isActive:true
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    }
                });
            } else {
                maintenances = await maintenanceClient.findMany({
                    where: {
                        createdAt: {
                            gte: start,
                            lte: end,
                        },
                        isActive:true
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    }
                });
            }

            return maintenances;
            
        } catch (error) {
            console.log(error);
            throw new Error(`${error}`);
        }
    }

    try {
        let maintenance;
        if (condition === "NOT") {
            maintenance = await maintenanceClient.findMany({
                where: {
                    [criteria]: {
                        not: value,
                    },
                    isActive:true,
                    ...(start && end ? {
                        createdAt: {
                            gte: start,
                        },
                        createdAt: {
                            lte: end,
                        },
                    } : {}),
                    
                },
                include:{
                    equipement:true,
                    incident:true,
                }
            });
        } else {
            maintenance = await maintenanceClient.findMany({
                where: {
                    [criteria]: value,
                    ...(start && end ? {
                        createdAt: {
                            gte: start,
                        },
                        createdAt: {
                            lte: end,
                        },
                    } : {}),
                    isActive:true,
                },
                include:{
                    equipement:true,
                    incident:true,
                }
            });
        }

        return maintenance;
    } catch (error) {
        console.log(error)
        return {"error":true, errors:[{msg:"N'a pas pu être exporté, essayez plus tard"}]};
    }
}


const handleFilteredSearch=async(filter, value, maintenances, token)=>{
    try {
        switch(filter){
            case 'siteId':
                // Check cache first
                const siteCacheKey = `site_${value}`;
                let siteResponse = getCachedData(siteCacheKey);
                
                if (!siteResponse) {
                    siteResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/sites?search=${value}`);
                    if (siteResponse.data) {
                        setCachedData(siteCacheKey, siteResponse);
                    }
                }

                if(siteResponse.data){
                    let siteIds = siteResponse.data.map(site => site.id);
                    maintenances = await maintenanceClient.findMany({
                        where:{
                            isActive:true,
                            siteId:{
                                in:siteIds
                            }
                        },
                        include:{
                            equipement:true,
                            incident:true,
                        },
                        orderBy:{
                            createdAt:'desc'
                        }
                    });
                    return maintenances
                }
                break
            case "createdBy":
                // Check cache first
                const employeeCacheKey = `employee_${value}`;
                let initiatorResponse = getCachedData(employeeCacheKey);
                
                if (!initiatorResponse) {
                    initiatorResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    if (initiatorResponse.data) {
                        setCachedData(employeeCacheKey, initiatorResponse);
                    }
                }

                if(initiatorResponse.data){
                    let employeesIds = initiatorResponse.data.map(employee => employee.id);
                    maintenances = await maintenanceClient.findMany({
                        where:{
                            isActive:true,
                            createdBy:{
                                in:employeesIds
                            }
                        },
                        include:{
                            equipement:true,
                            incident:true,
                        },
                        orderBy:{
                            createdAt:'desc'
                        }
                    });
                    return maintenances
                }
                break
            case 'closedBy':
                // Check cache first
                const closedByCacheKey = `employee_${value}`;
                let closedByResponse = getCachedData(closedByCacheKey);
                
                if (!closedByResponse) {
                    closedByResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    if (closedByResponse.data) {
                        setCachedData(closedByCacheKey, closedByResponse);
                    }
                }

                if(closedByResponse.data){
                    let employeesIds = closedByResponse.data.map(employee => employee.id);
                    maintenances = await maintenanceClient.findMany({
                        where:{
                            isActive:true,
                            status:"CLOSED",
                            closedBy:{
                                in:employeesIds
                            }
                        },
                        include:{
                            equipement:true,
                            incident:true,
                        },
                        orderBy:{
                            createdAt:'desc'
                        }
                    });
                    console.log(maintenances);
                    return maintenances
                }
                break
            case 'intervainer':
                // Check cache for employees
                const intervenerCacheKey = `employee_${value}`;
                let intervenerResponse = getCachedData(intervenerCacheKey);
                
                if (!intervenerResponse) {
                    intervenerResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    if (intervenerResponse.data) {
                        setCachedData(intervenerCacheKey, intervenerResponse);
                    }
                }

                // Check cache for suppliers
                const supplierCacheKey = `supplier_${value}`;
                let supplierResponse = getCachedData(supplierCacheKey);
                
                if (!supplierResponse) {
                    supplierResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/suppliers?search=${value}`);
                    if (supplierResponse.data) {
                        setCachedData(supplierCacheKey, supplierResponse);
                    }
                }

                let intervenerIds = intervenerResponse.data.map(intervener => intervener.id);
                let suppliersIds = supplierResponse.data.map(supplier => supplier.id);
                
                maintenances = await maintenanceClient.findMany({
                    where:{
                        isActive:true,
                        OR:[
                            {
                                technician:{
                                    in:intervenerIds
                                }
                            },
                            {
                                technician:{
                                    in:suppliersIds
                                }
                            }
                        ]
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    },
                    orderBy:{
                        createdAt:'desc'
                    }
                });
                return maintenances
                break
            case "incidentRef":
                let incidents = await prisma.incident.findMany({
                    where:{
                        isActive:true,
                        numRef: {
                            contains:value
                        }
                    }
                });
                let incidentIds = incidents.map(incident => incident.id);
                maintenances = await maintenanceClient.findMany({
                    where:{
                        isActive:true,
                        incidentId:{
                            in:incidentIds
                        }
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    },
                    orderBy:{
                        createdAt:'desc'
                    }
                })
                return maintenances
            break
            case "numRef":
                maintenances = await maintenanceClient.findMany({
                    where:{
                        isActive:true,
                        numRef:{
                            contains:value
                        }
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    },
                    orderBy:{
                        createdAt:'desc'
                    }
                })
                return maintenances
                break        
            case "equipementId":
                let equipements = await prisma.equipement.findMany({
                    where:{
                        isActive:true, 
                        name:{
                            contains:value
                        }
                    }
                });

                let equipementIds = equipements.map(equipement => equipement.id);

                maintenances = await maintenanceClient.findMany({
                    where:{
                        isActive:true,
                        equipementId:{
                            in:equipementIds
                        }
                    },
                    include:{
                        equipement:true,
                        incident:true,
                    },
                    orderBy:{
                        createdAt:'desc'
                    }
                });
                return maintenances;
            break;
        }
    } catch (error) {
        console.log(error)
        throw new Error();
    }
}