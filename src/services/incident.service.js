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
        // let incident = await incidentClient.create({
        //     data:{ ...body, numRef }
        // });
        // Créer l'incident avec les photos
        let incident = await incidentClient.create({
            data: { 
                ...body,
                numRef,
                // Créer les photos associées si elles existent
                photos: body.photos && body.photos.length > 0 ? {
                    create: body.photos.map(photo => ({
                        url: photo.url,
                        filename: photo.filename,
                        createdBy: body.createdBy
                    }))
                } : undefined
            },
            include: {
                photos: true // Inclure les photos dans la réponse
            }
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
            include: {
                consommable: true,
                equipement: {
                    include: {
                        equipmentGroup: { 
                            include: { 
                                equipmentGroupFamily: true 
                            } 
                        }
                    }
                },
                incidentCauses: true,
                incident: true,
                photos: true,
                maintenance: true
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
// export const getIncidentByParams = async (request, token) =>{
//     const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, filter, value, ...queries } = request; 
//     const skip = (page - 1) * limit;
    
//     try {
//         let incidents = []
//         let total = 0
//         if(filter && value){
//             switch (filter) {
//                 case 'site':
//                     // Get the site with name equals to the value
//                     let siteResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/sites?search=${value}`);
//                     if(siteResponse.data){
//                         let siteIds = siteResponse.data.map(site => site.id);
//                         let incidents = await incidentClient.findMany({
//                             where:{
//                                 isActive:true,
//                                 siteId:{
//                                     in:siteIds
//                                 }
//                             },
//                             skip: parseInt(skip),
//                             take: parseInt(LIMIT),
//                             include:{
//                                 equipement:true,
//                                 incidentCauses:true,
//                                 incident:true,
//                                 photos: true
//                             },
//                             orderBy:{
//                                 creationDate:'desc'
//                             }
//                         });
//                         const total = incidents.length;
//                         return {
//                             page: parseInt(page),
//                             totalPages: Math.ceil(total / LIMIT),
//                             total,
//                             data: incidents,
//                         };
//                     }
                    
//                     // Get the incidents where siteIds
//                     break;
//                 case 'createdBy':
//                     // Get the employee with name equals to the value
//                     let initiatorResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
//                     if(initiatorResponse.data){
//                         let employeesIds = initiatorResponse.data.map(employee => employee.id);
//                         let incidents = await incidentClient.findMany({
//                             where:{
//                                 isActive:true,
//                                 createdBy:{
//                                     in:employeesIds
//                                 }
//                             },
//                             skip: parseInt(skip),
//                             take: parseInt(LIMIT),
//                             include:{
//                                 equipement:true,
//                                 incidentCauses:true,
//                                 incident:true,
//                                 photos: true
//                             },
//                             orderBy:{
//                                 creationDate:'desc'
//                             }
//                         });
//                         const total = incidents.length;
//                         return {
//                             page: parseInt(page),
//                             totalPages: Math.ceil(total / LIMIT),
//                             total,
//                             data: incidents,
//                         };
//                     }
                    
//                     // Get the incidents where siteIds
//                     break;
//                 case 'intervener':
//                     // Get employee with name equal to value
//                     let intervenerResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
//                     let intervenerIds = intervenerResponse.data.map(intervener => intervener.id);
//                     // Get enity with name equal to value
//                     let supplierResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/suppliers?search=${value}`);
//                     let suppliersIds = supplierResponse.data.map(supplier => supplier.id);
//                     // Get incident where the intervener in the list of employee or entity returned
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             isActive:true,
//                             OR:[
//                                 {
//                                     technician:{
//                                         in:intervenerIds
//                                     }
//                                 },
//                                 {
//                                     technician:{
//                                         in:suppliersIds
//                                     }
//                                 }
//                             ]
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(LIMIT),
//                         include:{
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                         },
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     });

//                     const total = incidents.length;
//                     return {
//                         page: parseInt(page),
//                         totalPages: Math.ceil(total / LIMIT),
//                         total,
//                         data: incidents,
//                     };
//                     break
//                 case 'closedBy':
//                     // Get the employee with name equals to the value
//                     let closedByResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
//                     if(closedByResponse.data){
//                         let employeesIds = closedByResponse.data.map(employee => employee.id);
//                         let incidents = await incidentClient.findMany({
//                             where:{
//                                 isActive:true,
//                                 closedBy:{
//                                     in:employeesIds
//                                 }
//                             },
//                             skip: parseInt(skip),
//                             take: parseInt(LIMIT),
//                             include:{
//                                 equipement:true,
//                                 incidentCauses:true,
//                                 incident:true,
//                                 photos: true
//                             },
//                             orderBy:{
//                                 creationDate:'desc'
//                             }
//                         });
//                         const total = incidents.length;
//                         return {
//                             page: parseInt(page),
//                             totalPages: Math.ceil(total / LIMIT),
//                             total,
//                             data: incidents,
//                         };
//                     }
                    
//                     // Get the incidents where siteIds
//                     break;
//                 case 'shift':
//                     // Get the site with name equals to the value
//                     let shiftResponse = await handleExternalFetch(token, `${process.env.ENTITY_API}/shifts?search=${value}`);
//                     if(shiftResponse.data){
//                         let shiftIds = shiftResponse.data.map(shift => shift.id);
//                         let incidents = await incidentClient.findMany({
//                             where:{
//                                 isActive:true,
//                                 shiftId:{
//                                     in:shiftIds
//                                 }
//                             },
//                             skip: parseInt(skip),
//                             take: parseInt(LIMIT),
//                             include:{
//                                 equipement:true,
//                                 incidentCauses:true,
//                                 incident:true,
//                                 photos: true
//                             },
//                             orderBy:{
//                                 creationDate:'desc'
//                             }
//                         });
//                         const total = incidents.length;
//                         return {
//                             page: parseInt(page),
//                             totalPages: Math.ceil(total / LIMIT),
//                             total,
//                             data: incidents,
//                         };
//                     }
                    
//                     // Get the incidents where siteIds
//                     break;
//                 case 'numRef':
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             numRef:{
//                                 contains:value,
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(limit),
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     });
//                     break;
//                 case 'incidentId':
//                     // Get the incident type with the search value
//                     let incidentTypes = await prisma.incidenttype.findMany({
//                         where:{
//                             name:{
//                                 contains:value
//                             },
//                             isActive:true
//                         }
//                     });
    
//                     let typeIds = incidentTypes.map(type => type.id)
    
//                     // get the the incidents where incidentId equals to the incident type id returned
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             incidentId:{
//                                 in: typeIds
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(limit),
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     })
    
//                     break;
//                 case 'incidentCauseId':
//                     // Get the incident type with the search value
//                     let incidentCauses = await prisma.incidentcause.findMany({
//                         where:{
//                             name:{
//                                 contains:value
//                             },
//                             isActive:true
//                         }
//                     });
    
//                     let causesIds = incidentCauses.map(causes => causes.id)
    
//                     // get the the incidents where incidentId equals to the incident type id returned
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             incidentCauseId:{
//                                 in: causesIds
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(limit),
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     })
    
//                     break;
//                 case 'equipmentId':
//                     // Get the incident type with the search value
//                     let equipements = await prisma.equipment.findMany({
//                         where:{
//                             title:{
//                                 contains:value
//                             },
//                             isActive:true
//                         }
//                     });
    
//                     let equipmentIds = equipements.map(equipement => equipement.id)
    
//                     // get the the incidents where equipementIds equals to the equipement id returned
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             equipementId:{
//                                 in: equipmentIds
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(limit),
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     })
    
//                     break;
//                 case 'description':
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             description:{
//                                 contains:value
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         skip: parseInt(skip),
//                         take: parseInt(limit),
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     })
//                     break;
//                 case 'statut':
//                     // get the incident where there is a given status
//                     incidents = await incidentClient.findMany({
//                         where:{
//                             status:value,
//                             isActive:true
//                         },
//                         include:{
//                             consommable:true,
//                             equipement:true,
//                             incidentCauses:true,
//                             incident:true,
//                             photos: true
//                         },
//                         orderBy:{
//                             creationDate:'desc'
//                         }
//                     });
//                     break
//                 case 'date':
//                     let start;
//                     let end;
//                     let dates = value.split(",");
//                     let startDate = dates[0];
//                     let endDate = dates[1];
//                     if(startDate){
//                         start = new Date(startDate);
//                         start.setHours(0, 0, 0, 0);
//                         start = start.toISOString();
//                     }
                
//                     if(endDate){
//                         end = new Date(endDate);
//                         end.setHours(23, 59, 59, 999);
//                         end = end.toISOString();
//                     }

//                     console.log(dates, end, start);

//                     incidents = await incidentClient.findMany({
//                         where: {
//                             creationDate: {
//                                 gte: start,
//                                 lte: end,
//                             },
//                             isActive:true
//                         },
//                         include:{
//                             equipement:true,
//                             incident:true,
//                             maintenance:true,
//                             incidentCauses:true,
//                             photos: true
//                         }
//                     })
//                     break
//                 default:
//                     break;
//             }
//         } 
//         else{
//             incidents = await incidentClient.findMany({
//                 where:!search ? {isActive:true, ...queries} : 
//                 {
//                     OR:[
//                         {
//                             numRef:{
//                                 contains:search
//                             },
//                             isActive:true
//                         },
//                         {
//                             incident:{
//                                 name:{contains:search}
//                             },
//                             isActive:true
//                         },
//                         {
//                             description:{
//                                 contains: search
//                             },
//                             isActive:true
//                         }
//                     ],
//                 },
//                 include:{
//                     consommable:true,
//                     equipement:true,
//                     incidentCauses:true,
//                     incident:true,
//                     photos: true
//                 },
//                 skip: search ? parseInt(limit) : undefined,
//                 take: search ? parseInt(limit) : undefined,
//                 orderBy:{
//                     creationDate:'desc'
//                 }
//             });
//         }

//         total = incidents.length;
//         return search ? {data: incidents} :{
//             page: parseInt(page),
//             totalPages: Math.ceil(total / limit),
//             total,
//             data: incidents,
//         };

//     } catch (error) {
//         console.log(error);
//         throw new Error(`${error}`);
//     }
// }
export const getIncidentByParams = async (request, token) => {
    // 1. Normalisation des paramètres avec constantes définies ailleurs
    const { 
        page = 1, 
        limit = LIMIT, 
        sortBy = 'creationDate',
        order = 'desc', 
        search, 
        filter, 
        value, 
        ...queries 
    } = request;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    try {
        let whereClause = { isActive: true };

        // 2. Construction dynamique du filtre "where"
        if (filter && value) {
            await buildFilterClause(whereClause, filter, value, token);
        } else if (search) {
            // Recherche générale (sans filtre spécifique)
            whereClause.OR = [
                { numRef: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { incident: { name: { contains: search, mode: 'insensitive' } } }
            ];
        } else {
            // Appliquer les autres requeries directement
            Object.assign(whereClause, queries);
        }

        // 3. Vérification du tableau vide pour les filtres externes
        if (filter && ['site', 'createdBy', 'closedBy', 'intervener', 'shift', 'incidentId', 'incidentCauseId', 'equipmentId'].includes(filter)) {
            // Vérifier si le filtre a un tableau 'in' vide
            const filterKey = getFilterKey(filter);
            if (whereClause[filterKey]?.in?.length === 0) {
                return {
                    page: parseInt(page),
                    limit: take,
                    totalPages: 0,
                    total: 0,
                    data: [],
                };
            }
        }

        // 4. Exécution des requêtes en parallèle (Performance)
        const [incidents, total] = await Promise.all([
            incidentClient.findMany({
                where: whereClause,
                skip,
                take,
                include: {
                    consommable: true,
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    },
                    incidentCauses: true,
                    incident: true,
                    photos: true,
                    maintenance: true
                },
                orderBy: { [sortBy]: order } // CORRECTION ICI: Utiliser 'order' pas 'creationDate'
            }),
            incidentClient.count({ where: whereClause })
        ]);

        // 5. Formatage de la réponse
        return {
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
            total,
            data: incidents,
        };

    } catch (error) {
        console.error("Error in getIncidentByParams:", error);
        throw new Error(`Erreur lors de la récupération des incidents: ${error.message}`);
    }
};

// Fonction helper pour obtenir la clé du filtre
const getFilterKey = (filter) => {
    const filterMap = {
        'site': 'siteId',
        'createdBy': 'createdBy',
        'closedBy': 'closedBy',
        'intervener': 'technician',
        'shift': 'shiftId',
        'incidentId': 'incidentId',
        'incidentCauseId': 'incidentCauseId',
        'equipmentId': 'equipementId'
    };
    return filterMap[filter] || filter;
};

// Helper function pour construire dynamiquement les clauses WHERE
const buildFilterClause = async (whereClause, filter, value, token) => {
    switch (filter) {
        case 'site':
            const siteRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/sites?search=${value}`);
            const siteIds = siteRes?.data?.map(site => site.id) || [];
            whereClause.siteId = { in: siteIds };
            break;

        case 'createdBy':
        case 'closedBy':
            const empRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
            const empIds = empRes?.data?.map(employee => employee.id) || [];
            whereClause[filter] = { in: empIds };
            break;

        case 'intervener':
            const [intRes, supRes] = await Promise.all([
                handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`),
                handleExternalFetch(token, `${process.env.ENTITY_API}/suppliers?search=${value}`)
            ]);
            const combinedIds = [
                ...(intRes?.data?.map(intervener => intervener.id) || []),
                ...(supRes?.data?.map(supplier => supplier.id) || [])
            ];
            whereClause.technician = { in: combinedIds };
            break;

        case 'shift':
            const shiftRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/shifts?search=${value}`);
            const shiftIds = shiftRes?.data?.map(shift => shift.id) || [];
            whereClause.shiftId = { in: shiftIds };
            break;

        case 'numRef':
        case 'description':
            whereClause[filter] = { contains: value, mode: 'insensitive' };
            break;

        case 'date':
            const [startDate, endDate] = value.split(",");
            whereClause.creationDate = {};
            
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                whereClause.creationDate.gte = start; // Pas besoin de .toISOString()
            }
            
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.creationDate.lte = end; // Pas besoin de .toISOString()
            }
            break;

        case 'statut':
            whereClause.status = value;
            break;

        case 'incidentId':
            // Recherche par type d'incident
            const incidentTypes = await prisma.incidenttype.findMany({
                where: {
                    name: { contains: value, mode: 'insensitive' },
                    isActive: true
                }
            });
            const typeIds = incidentTypes.map(type => type.id);
            whereClause.incidentId = { in: typeIds };
            break;

        case 'incidentCauseId':
            // Recherche par cause d'incident
            const incidentCauses = await prisma.incidentcause.findMany({
                where: {
                    name: { contains: value, mode: 'insensitive' },
                    isActive: true
                }
            });
            const causesIds = incidentCauses.map(cause => cause.id);
            whereClause.incidentCauseId = { in: causesIds };
            break;

        case 'equipmentId':
            // Recherche par équipement
            const equipements = await prisma.equipment.findMany({
                where: {
                    title: { contains: value, mode: 'insensitive' },
                    isActive: true
                }
            });
            const equipmentIds = equipements.map(equipment => equipment.id);
            whereClause.equipementId = { in: equipmentIds };
            break;

        default:
            // Pour les filtres non gérés spécifiquement
            if (Object.keys(whereClause).includes(filter)) {
                whereClause[filter] = { contains: value, mode: 'insensitive' };
            }
            break;
    }
};

// Version alternative si vous préférez tout dans une seule fonction sans helper
export const getIncidentByParamsAlt = async (request, token) => {
    const { 
        page = 1, 
        limit = LIMIT, 
        sortBy = SORT_BY, 
        order = ORDER, 
        search, 
        filter, 
        value, 
        ...queries 
    } = request;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    try {
        let whereClause = { isActive: true };

        if (filter && value) {
            // Gestion de tous les filtres dans le switch principal
            switch (filter) {
                case 'site':
                    const siteRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/sites?search=${value}`);
                    whereClause.siteId = { in: siteRes?.data?.map(s => s.id) || [] };
                    break;

                case 'createdBy':
                case 'closedBy':
                    const empRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`);
                    whereClause[filter] = { in: empRes?.data?.map(e => e.id) || [] };
                    break;

                case 'intervener':
                    const [intRes, supRes] = await Promise.all([
                        handleExternalFetch(token, `${process.env.ENTITY_API}/employees?search=${value}`),
                        handleExternalFetch(token, `${process.env.ENTITY_API}/suppliers?search=${value}`)
                    ]);
                    const ids = [
                        ...(intRes?.data?.map(i => i.id) || []),
                        ...(supRes?.data?.map(s => s.id) || [])
                    ];
                    whereClause.technician = { in: ids };
                    break;

                case 'shift':
                    const shiftRes = await handleExternalFetch(token, `${process.env.ENTITY_API}/shifts?search=${value}`);
                    whereClause.shiftId = { in: shiftRes?.data?.map(s => s.id) || [] };
                    break;

                case 'numRef':
                case 'description':
                    whereClause[filter] = { contains: value };
                    break;

                case 'date':
                    const [startDate, endDate] = value.split(",");
                    whereClause.creationDate = {};
                    if (startDate) {
                        const start = new Date(startDate);
                        start.setHours(0, 0, 0, 0);
                        whereClause.creationDate.gte = start.toISOString();
                    }
                    if (endDate) {
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        whereClause.creationDate.lte = end.toISOString();
                    }
                    break;

                case 'statut':
                    whereClause.status = value;
                    break;

                case 'incidentId':
                    const incidentTypes = await prisma.incidenttype.findMany({
                        where: { name: { contains: value }, isActive: true }
                    });
                    whereClause.incidentId = { in: incidentTypes.map(t => t.id) };
                    break;

                case 'incidentCauseId':
                    const incidentCauses = await prisma.incidentcause.findMany({
                        where: { name: { contains: value }, isActive: true }
                    });
                    whereClause.incidentCauseId = { in: incidentCauses.map(c => c.id) };
                    break;

                case 'equipmentId':
                    const equipments = await prisma.equipment.findMany({
                        where: { title: { contains: value }, isActive: true }
                    });
                    whereClause.equipementId = { in: equipments.map(e => e.id) };
                    break;

                default:
                    if (Object.keys(whereClause).includes(filter)) {
                        whereClause[filter] = { contains: value };
                    }
                    break;
            }
        } else if (search) {
            whereClause.OR = [
                { numRef: { contains: search } },
                { description: { contains: search } },
                { incident: { name: { contains: search } } }
            ];
        } else {
            Object.assign(whereClause, queries);
        }

        const [incidents, total] = await Promise.all([
            incidentClient.findMany({
                where: whereClause,
                skip,
                take,
                include: {
                    consommable: true,
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    },
                    incidentCauses: true,
                    incident: true,
                    photos: true,
                    maintenance: true
                },
                orderBy: { [sortBy]: order }
            }),
            incidentClient.count({ where: whereClause })
        ]);

        return {
            page: parseInt(page),
            limit: take,
            totalPages: Math.ceil(total / take),
            total,
            data: incidents,
        };

    } catch (error) {
        console.error("Error in getIncidentByParams:", error);
        throw new Error(`Erreur lors de la récupération des incidents: ${error.message}`);
    }
};



/**
 * 
 * @param id 
 * @param body 
 * @returns 
 */
export const putIntoMaintenanceIncidentService = async (id, body) =>{
    console.log("ici intoM");
    console.log("body.incidentId :", body.incidentId);
    try {
        const typeIncidentExist = await prisma.incidenttype.findFirst({where:{id:body.incidentId, isActive:true}});
        console.log("typeIncidentExist :", typeIncidentExist);

        if(!typeIncidentExist) return (Errors("Le type d'incident sélectionné n'existe pas"));

        let {updatedBy, createdBy, ...data} = body;
        console.log("data :", data);
        
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
export const updateIncidentService = async (id, body) =>{
    console.log(id);
    console.log(body);
    try {
        if(body?.equipementId){
            const equipementExist = await prisma.equipment.findFirst({where:{id:body.equipementId, isActive:true}});
            if(!equipementExist) return (Errors("L'équipement sélectionné n'existe pas"));
        }
        if(body?.incidentId){
            const typeIncidentExist = await prisma.incidenttype.findFirst({where:{id:body.incidentId, isActive:true}});
            if(!typeIncidentExist) return (Errors("Le type d'incident sélectionné n'existe pas"));
        }
        if(body?.incidentCauseId){
            const causeIncidentExist = await prisma.incidentcause.findFirst({where:{id:body.incidentCauseId, isActive:true}});
            if(!causeIncidentExist) return (Errors("La cause d'incident sélectionné n'existe pas"));
        }

        let {updatedBy, createdBy, ...data} = body;
        let date =  new Date();
        if(body?.status === "CLOSED"){
            data.closedDate = date;
            data.closedBy = updatedBy;
            // Ajouter la date manuelle si fournie - CORRECTION ICI
            if(body.closedManuDate) {  // Utilisez body.closedManuDate au lieu de closedManuDate
                data.closedManuDate = new Date(body.closedManuDate);
                console.log('Date avant formatage:', data.closedManuDate);
                const date = new Date(data.closedManuDate);
                console.log('Date après new Date():', date);
                console.log('Date en ISO:', date.toISOString());
                data.closedManuDate = date.toISOString();
            }
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

export const reclassifyIncidentService = async (id, body) => {
    console.log("id :",id);
    console.log("body :", body);
    try {
        console.log("🔍 DEBUG - ID reçu:", id);
        console.log("🔍 DEBUG - BODY reçu:", body);
        
        // Récupérer l'incident existant pour avoir les valeurs actuelles
        const existingIncident = await incidentClient.findUnique({
            where: { id }
        });
        
        if (!existingIncident) {
            return Errors("Incident non trouvé");
        }

        console.log("🔍 DEBUG - Incident existant:", existingIncident);
        
        // Les données devraient arriver directement dans body
        // const { equipementId, incidentId, incidentCauseId } = body;
        // Les données devraient arriver directement dans body
        const { equipementId, incidentId, incidentCauseId, updatedBy } = body;

        // Validations seulement si une nouvelle valeur est fournie
        if(equipementId && equipementId !== existingIncident.equipementId){
            const equipementExist = await prisma.equipment.findFirst({where:{id:equipementId, isActive:true}});
            if(!equipementExist) return (Errors("L'équipement sélectionné n'existe pas"));
        }
        
        if(incidentId && incidentId !== existingIncident.incidentId){
            const typeIncidentExist = await prisma.incidenttype.findFirst({where:{id:incidentId, isActive:true}});
            if(!typeIncidentExist) return (Errors("Le type d'incident sélectionné n'existe pas"));
        }
        
        if(incidentCauseId && incidentCauseId !== existingIncident.incidentCauseId){
            const causeIncidentExist = await prisma.incidentcause.findFirst({where:{id:incidentCauseId, isActive:true}});
            if(!causeIncidentExist) return (Errors("La cause d'incident sélectionné n'existe pas"));
        }

        // Construire l'objet de mise à jour avec les nouvelles valeurs ou les anciennes
        const updateData = {};
        
        // Utiliser la nouvelle valeur si fournie, sinon garder l'ancienne
        if (equipementId !== undefined) {
            updateData.equipementId = equipementId || null;
        }
        
        if (incidentId !== undefined) {
            updateData.incidentId = incidentId || null;
        }
        
        if (incidentCauseId !== undefined) {
            updateData.incidentCauseId = incidentCauseId || null;
        }

        // Ajouter le champ reclassifiedBy avec la valeur de updatedBy
        if (updatedBy !== undefined) {
            updateData.reclassifiedBy = updatedBy;
        }

        console.log("🔍 DEBUG - Données de mise à jour:", updateData);

        // Mise à jour seulement si au moins un champ a changé
        if (Object.keys(updateData).length > 0) {
            let incident = await incidentClient.update({
                where: { id },
                data: updateData
            });
            
            console.log("✅ Incident mis à jour:", incident);
            return incident;
        } else {
            console.log("ℹ️ Aucune modification nécessaire");
            return existingIncident;
        }
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
                        equipement: {
                            include: {
                                equipmentGroup: { 
                                    include: { 
                                        equipmentGroupFamily: true 
                                    } 
                                }
                            }
                        },
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
                        equipement: {
                            include: {
                                equipmentGroup: { 
                                    include: { 
                                        equipmentGroupFamily: true 
                                    } 
                                }
                            }
                        },
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
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    },
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
                    equipement: {
                        include: {
                            equipmentGroup: { 
                                include: { 
                                    equipmentGroupFamily: true 
                                } 
                            }
                        }
                    },
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