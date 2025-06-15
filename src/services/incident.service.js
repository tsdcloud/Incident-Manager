import {prisma} from '../config.js';
import { generateRefNum } from '../utils/utils.js';
import { Errors } from '../utils/errors.utils.js';
import { handleExternalFetch } from '../utils/employees.utils.js';
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

        const equipementExist = await prisma.equipment.findFirst({where:{id:body.equipementId, isActive:true}});
        const typeIncidentExist = await prisma.incidenttype.findFirst({where:{id:body.incidentId, isActive:true}});

        if(!equipementExist) return (Errors("L'équipement sélectionné n'existe pas", "field"));
        if(!typeIncidentExist) return (Errors("Le type d'incident sélectionné n'existe pas", "field"));

        const numRef = generateRefNum(lastIncident);
        let incident = await incidentClient.create({
            data:{ ...body, numRef }
        });

        return incident;
    } catch (error) {
        console.log(error)
        return (Errors(error.message, "field"))
    }
}


/**
 * 
 * @returns 
 */
export const getAllIncidentService = async() =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let incidents = await incidentClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            include:{
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
export const getIncidentByParams = async (request, token) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, filter, value, ...queries } = request; 
    const skip = (page - 1) * limit;
    
    try {
        let incidents = []
        let total = 0
        if(filter && value){
            switch (filter) {
                case 'site':
                    // Get the site with name equals to the value
                    let siteResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/sites?search=${value}`);
                    if(siteResponse.data){
                        let siteIds = siteResponse.data.map(site => site.id);
                        let incidents = await incidentClient.findMany({
                            where:{
                                isActive:true,
                                siteId:{
                                    in:siteIds
                                }
                            },
                            skip: parseInt(skip),
                            take: parseInt(LIMIT),
                            include:{
                                equipement:true,
                                incidentCauses:true,
                                incident:true,
                            },
                            orderBy:{
                                creationDate:'desc'
                            }
                        });
                        const total = incidents.length;
                        return {
                            page: parseInt(page),
                            totalPages: Math.ceil(total / LIMIT),
                            total,
                            data: incidents,
                        };
                    }
                    
                    // Get the incidents where siteIds
                    break;
                case 'createdBy':
                    // Get the employee with name equals to the value
                    let initiatorResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    if(initiatorResponse.data){
                        let employeesIds = initiatorResponse.data.map(employee => employee.id);
                        let incidents = await incidentClient.findMany({
                            where:{
                                isActive:true,
                                createdBy:{
                                    in:employeesIds
                                }
                            },
                            skip: parseInt(skip),
                            take: parseInt(LIMIT),
                            include:{
                                equipement:true,
                                incidentCauses:true,
                                incident:true,
                            },
                            orderBy:{
                                creationDate:'desc'
                            }
                        });
                        const total = incidents.length;
                        return {
                            page: parseInt(page),
                            totalPages: Math.ceil(total / LIMIT),
                            total,
                            data: incidents,
                        };
                    }
                    
                    // Get the incidents where siteIds
                    break;
                case 'intervener':
                    // Get employee with name equal to value
                    let intervenerResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    let intervenerIds = intervenerResponse.data.map(intervener => intervener.id);
                    // Get enity with name equal to value
                    let supplierResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/suppliers?search=${value}`);
                    let suppliersIds = supplierResponse.data.map(supplier => supplier.id);
                    // Get incident where the intervener in the list of employee or entity returned
                    incidents = await incidentClient.findMany({
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
                        skip: parseInt(skip),
                        take: parseInt(LIMIT),
                        include:{
                            equipement:true,
                            incidentCauses:true,
                            incident:true,
                        },
                        orderBy:{
                            creationDate:'desc'
                        }
                    });

                    const total = incidents.length;
                    return {
                        page: parseInt(page),
                        totalPages: Math.ceil(total / LIMIT),
                        total,
                        data: incidents,
                    };
                    break
                case 'closedBy':
                    // Get the employee with name equals to the value
                    let closedByResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    if(closedByResponse.data){
                        let employeesIds = closedByResponse.data.map(employee => employee.id);
                        let incidents = await incidentClient.findMany({
                            where:{
                                isActive:true,
                                closedBy:{
                                    in:employeesIds
                                }
                            },
                            skip: parseInt(skip),
                            take: parseInt(LIMIT),
                            include:{
                                equipement:true,
                                incidentCauses:true,
                                incident:true,
                            },
                            orderBy:{
                                creationDate:'desc'
                            }
                        });
                        const total = incidents.length;
                        return {
                            page: parseInt(page),
                            totalPages: Math.ceil(total / LIMIT),
                            total,
                            data: incidents,
                        };
                    }
                    
                    // Get the incidents where siteIds
                    break;
                case 'shift':
                    // Get the site with name equals to the value
                    let shiftResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/shifts?search=${value}`);
                    if(shiftResponse.data){
                        let shiftIds = shiftResponse.data.map(shift => shift.id);
                        let incidents = await incidentClient.findMany({
                            where:{
                                isActive:true,
                                shiftId:{
                                    in:shiftIds
                                }
                            },
                            skip: parseInt(skip),
                            take: parseInt(LIMIT),
                            include:{
                                equipement:true,
                                incidentCauses:true,
                                incident:true,
                            },
                            orderBy:{
                                creationDate:'desc'
                            }
                        });
                        const total = incidents.length;
                        return {
                            page: parseInt(page),
                            totalPages: Math.ceil(total / LIMIT),
                            total,
                            data: incidents,
                        };
                    }
                    
                    // Get the incidents where siteIds
                    break;
                case 'numRef':
                    incidents = await incidentClient.findMany({
                        where:{
                            numRef:{
                                contains:value,
                            },
                            isActive:true
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
                    break;
                case 'incidentId':
                    // Get the incident type with the search value
                    let incidentTypes = await prisma.incidenttype.findMany({
                        where:{
                            name:{
                                contains:value
                            },
                            isActive:true
                        }
                    });
    
                    let typeIds = incidentTypes.map(type => type.id)
    
                    // get the the incidents where incidentId equals to the incident type id returned
                    incidents = await incidentClient.findMany({
                        where:{
                            incidentId:{
                                in: typeIds
                            },
                            isActive:true
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
                    })
    
                    break;
                case 'incidentCauseId':
                    // Get the incident type with the search value
                    let incidentCauses = await prisma.incidentcause.findMany({
                        where:{
                            name:{
                                contains:value
                            },
                            isActive:true
                        }
                    });
    
                    let causesIds = incidentCauses.map(causes => causes.id)
    
                    // get the the incidents where incidentId equals to the incident type id returned
                    incidents = await incidentClient.findMany({
                        where:{
                            incidentCauseId:{
                                in: causesIds
                            },
                            isActive:true
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
                    })
    
                    break;
                case 'equipmentId':
                    // Get the incident type with the search value
                    let equipements = await prisma.equipment.findMany({
                        where:{
                            title:{
                                contains:value,
                                isActive:true
                            }
                        }
                    });
    
                    let equipmentIds = equipements.map(equipement => equipement.id)
    
                    // get the the incidents where equipementIds equals to the equipement id returned
                    incidents = await incidentClient.findMany({
                        where:{
                            equipementId:{
                                in: equipmentIds
                            },
                            isActive:true
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
                    })
    
                    break;
                case 'description':
                    incidents = await incidentClient.findMany({
                        where:{
                            description:{
                                contains:value
                            },
                            isActive:true
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
                    })
                    break;
                case 'statut':
                    // get the incident where there is a given status
                    incidents = await incidentClient.findMany({
                        where:{
                            status:value,
                            isActive:true
                        },
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
                    break
                case 'date':
                    let start;
                    let end;
                    let dates = value.split(",");
                    let startDate = dates[0];
                    let endDate = dates[1];
                    if(startDate){
                        start = new Date(startDate);
                        start.setHours(0, 0, 0, 0);
                        start = start.toISOString();
                    }
                
                    if(endDate){
                        end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        end = end.toISOString();
                    }

                    console.log(dates, end, start);

                    incidents = await incidentClient.findMany({
                        where: {
                            creationDate: {
                                gte: start,
                                lte: end,
                            },
                            isActive:true
                        },
                        include:{
                            equipement:true,
                            incident:true,
                            maintenance:true,
                            incidentCauses:true
                        }
                    })
                    break
                default:
                    break;
            }
        } 
        else{
            incidents = await incidentClient.findMany({
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
                    ],
                },
                include:{
                    consommable:true,
                    equipement:true,
                    incidentCauses:true,
                    incident:true,
                },
                skip: search ? parseInt(limit) : undefined,
                take: search ? parseInt(limit) : undefined,
                orderBy:{
                    creationDate:'desc'
                }
            });
        }

        total = incidents.length;
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
        const equipementExist = await prisma.equipment.findFirst({where:{id:body.equipementId, isActive:true}});
        const typeIncidentExist = await prisma.incidenttype.findFirst({where:{id:body.incidentId, isActive:true}});

        if(!equipementExist) return (Errors("L'équipement sélectionné n'existe pas"));
        if(!typeIncidentExist) return (Errors("Le type d'incident sélectionné n'existe pas"));

        let {updatedBy, createdBy, ...data} = body;
        let date =  new Date();
        if(body?.status === "CLOSED"){
            data.closedDate = date;
            data.closedBy = updatedBy;
        }
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
    
    if(criteria === "date"){
        try {
            let incidents;

            if (condition === "NOT") {
                incidents = await incidentClient.findMany({
                    where: {
                        creationDate: {
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
                        maintenance:true,
                        incidentCauses:true
                    }
                });
            } else {
                incidents = await incidentClient.findMany({
                    where: {
                        creationDate: {
                            gte: start,
                            lte: end,
                        },
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
            console.log(error);
            throw new Error(`${error}`);
        }
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
        console.log(error);
        throw new Error(error);
    }
}


export const getStatsService = async () => {
    try {
        let totalIncidents = await incidentClient.count();

        // Count by incident type
        const byIncidentType = await incidentClient.groupBy({
            by: ['incidentId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            where: { isActive: true }
        });

        // Get incident names for the grouped results
        const incidentTypes = await prisma.incidenttype.findMany({
            where: {
                id: { in: byIncidentType.map(item => item.incidentId) }
            },
            select: {
                id: true,
                name: true
            }
        });

        // Create a map of incident IDs to names
        const incidentTypeMap = new Map(incidentTypes.map(type => [type.id, type.name]));
        
        // Count by incident equipment
        // const byIncidentEquipment = await incidentClient.groupBy({
        //     by: ['equipementId'],
        //     _count: { id: true },
        //     orderBy: { _count: { id: 'desc' } },
        //     where: { equipementId: { not: null }, isActive: true }
        // });

        // // Count by incident Cause
        // const byIncidentCause = await incidentClient.groupBy({
        //     by: ['incidentCauseId'],
        //     _count: { id: true },
        //     orderBy: { _count: { id: 'desc' } },
        //     where: { incidentCauseId: { not: null }, isActive: true }
        // });

        return {
            totalIncidents,
            byIncidentType: byIncidentType.map(item => ({
                type: incidentTypeMap.get(item.incidentId),
                count: item._count.id,
                percentage: (item._count.id / totalIncidents) * 100
            })),
            // byIncidentEquipment: byIncidentEquipment.map(item => ({
            //     equipment: item.equipementId || 'Unknown',
            //     count: item._count.id,
            //     percentage: (item._count.id / totalIncidents) * 100
            // })),
            // byIncidentCause: byIncidentCause.map(item => ({
            //     cause: item.incidentCauseId || 'Unknown',
            //     count: item._count.id,
            //     percentage: (item._count.id / totalIncidents) * 100
            // }))
        };
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}