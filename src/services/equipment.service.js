import {prisma} from '../config.js';
import ExcelJs from 'exceljs';
import { generateRefNum } from '../utils/utils.js';
import {Errors} from '../utils/errors.utils.js'
import { apiResponse } from '../utils/apiResponse.js';


const equipementClient = prisma.equipment;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create an equipement
 * @param body 
 * @returns 
 */
export const createEquipementService = async (body)=>{

    let {numRef, title, siteId} = body;


    if(numRef){
        let equipement = await equipementClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (equipement) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);;
    }

    if(title){
        let equipement = await equipementClient.findFirst({
            where:{title, siteId, isActive:true}
        })
        if (equipement) return apiResponse(true, [{msg: "Name already exist", field: "name"}]);;
    }
     
    try {
        const lastEquipment = await equipementClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });
        let {operatingMode, lifeSpan, periodicity, ...rest} = body;
        let fmtOperationMode = parseFloat(operatingMode);
        let fmtlifeSpan = parseFloat(lifeSpan);
        let fmtPeriodicity = parseFloat(periodicity);

        const numRef = generateRefNum(lastEquipment);
        let equipement = await equipementClient.create({
            data:{numRef, periodicity:fmtPeriodicity, operatingMode: fmtOperationMode, lifeSpan:fmtlifeSpan, ...rest}
        });
        return equipement;
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{msg: error, field: "server"}]);
    }
}


/**
 * Get all the equipments
 * @returns 
 */
export const getAllEquipmentService = async() =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let equipements = await equipementClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                title:'asc'
            },
            include:{
                equipmentGroup: {
                    include: {
                        equipmentGroupFamily: true,
                    },
                },
                movement:true,
                maintenance:true,
                operations:true
            }
        });
        // console.log(equipements);

        // Calculate nextMaintenance for each equipment
        equipements = equipements.map(equipment => {
            const periodicityInDays = equipment.periodicity;
            let nextMaintenance;
            
            if (!equipment.lastMaintenance) {
                nextMaintenance = new Date(equipment.createdAt);
                nextMaintenance.setDate(nextMaintenance.getDate() + periodicityInDays);
            } else {
                nextMaintenance = new Date(equipment.lastMaintenance);
                nextMaintenance.setDate(nextMaintenance.getDate() + periodicityInDays);
            }
            
            return {
                ...equipment,
                nextMaintenance
            };
        });

        const total = await equipementClient.count({where:{isActive:true}});
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: equipements,
        };
    } catch (error) {
        console.log(error);
        return Errors(`${error}`, 'server');
    }
}


/**
 * Return the list of equipements from site
 * @param {*} siteId 
 * @returns  object
 */
// export const getSiteEquipmentsService = async(siteId) => {
//     try {
//         let equipements = await equipementClient.findMany({
//             where:{
//                 siteId, isActive:true
//             },
//             include:{
//                 // equipmentGroup:true,
//                 equipmentGroup: {
//                     include: {
//                         equipmentGroupFamily: true,
//                     },
//                 },
//                 movement:true,
//                 maintenance:true,
//                 operations:true
//             },
//             orderBy:{
//                 title:"asc"
//             }
//         });
//         return apiResponse(false, undefined, equipements);
//     } catch (error) {
//         console.log(error);
//         return apiResponse(true, [{message:`${error}`, field:'server'}]);
//     }
// }
export const getSiteEquipmentsService = async(siteId, search) => {
    try {
        // Initialiser l'objet where
        let whereCondition = {
            siteId: siteId,
            isActive: true
        };
        
        // Ajouter la recherche si fournie et non vide
        if (search && typeof search === 'string' && search.trim() !== '') {
            whereCondition.OR = [
                { title: { contains: search } },
                { numRef: { contains: search } },
            ];
        }
        
        let equipements = await equipementClient.findMany({
            where: whereCondition,
            include: {
                equipmentGroup: {
                    include: {
                        equipmentGroupFamily: true,
                    },
                },
                movement: true,
                maintenance: true,
                operations: true
            },
            orderBy: {
                title: "asc"
            }
        });
        
        return apiResponse(false, undefined, equipements);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message: `${error}`, field: 'server'}]);
    }
}


/**
 * 
 * @param id 
 * @returns 
 */
export const getEquipementByIdService = async(id) =>{
    try {
        let equipement = await equipementClient.findFirst({
            where:{id, isActive: true},
            include:{
                equipmentGroup: {
                    include: {
                        equipmentGroupFamily: true,
                    },
                },
                movement:true,
                maintenance:true,
                operations:true
            },
        });
        // console.log(equipement);
        console.log(equipement.equipmentGroup.equipmentGroupFamily.domain);
        return equipement;
    } catch (error) {
        console.log(error);
        return Errors(`${error}`, 'server');
    }
}

// /**
//  * Get equipments by params
//  * @param request 
//  * @returns 
//  */
// export const getEquipementByParams = async (request) =>{
//     const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
//     const skip = (page - 1) * limit;
//     try {
//         let equipement = await equipementClient.findMany({
//             where:!search ? {isActive:true, ...queries} : {
//                 OR:[
//                     {title:{contains:search}},
//                     {numRef:{contains:search}}
//                 ],
//                 isActive:true
//             },
//             include:{
//                 equipmentGroup:true,
//                 movement:true,
//                 maintenance:true,
//                 operations:true
//             },
//             skip: parseInt(skip),
//             take: parseInt(limit),
//             orderBy:{
//                 title:'asc'
//             }
//         });
//         const total = await equipementClient.count();
//         return search ? {data: equipement} :{
//             page: parseInt(page),
//             totalPages: Math.ceil(total / limit),
//             total,
//             data: equipement,
//         };
//     } catch (error) {
//         console.log(error);
//         return Errors(`${error}`, 'server');
//     }
// }
/**
 * Get equipments by params
 * @param request 
 * @returns 
 */
// export const getEquipementByParams = async (request) =>{
//     const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, siteId, ...queries } = request; 
//     const skip = (page - 1) * limit;
    
//     try {
//         // Construire la condition where
//         let whereCondition = { isActive: true };
        
//         // Ajouter le filtre par site si fourni
//         if (siteId) {
//             whereCondition.siteId = siteId;
//         }
        
//         // Ajouter la recherche si fournie
//         if (search) {
//             whereCondition.OR = [
//                 { title: { contains: search } },
//                 { numRef: { contains: search } }
//             ];
//         }
        
//         // Ajouter les autres queries
//         whereCondition = { ...whereCondition, ...queries };

//         let equipement = await equipementClient.findMany({
//             where: whereCondition,
//             include:{
//                 equipmentGroup: {
//                     include: {
//                         equipmentGroupFamily: true,
//                     },
//                 },
//                 movement:true,
//                 maintenance:true,
//                 operations:true
//             },
//             skip: parseInt(skip),
//             take: parseInt(limit),
//             orderBy: {
//                 title: 'asc'
//             }
//         });
//         console.log(equipement);
        
//         const total = await equipementClient.count({ where: whereCondition });
        
//         return {
//             page: parseInt(page),
//             totalPages: Math.ceil(total / limit),
//             total,
//             data: equipement,
//         };
//     } catch (error) {
//         console.log(error);
//         return Errors(`${error}`, 'server');
//     }
// }

export const getEquipementByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, siteId, domain, ...queries } = request; 
    const skip = (page - 1) * limit;
    
    try {
        // Construire la condition where
        let whereCondition = { isActive: true };
        
        // Ajouter le filtre par site si fourni
        if (siteId) {
            whereCondition.siteId = siteId;
        }
        
        // Ajouter la recherche si fournie
        if (search) {
            whereCondition.OR = [
                { title: { contains: search } },
                { numRef: { contains: search } },
                { equipmentGroup: { name: { contains: search } } }
            ];
        }
        
        // Ajouter le filtre par domaine
        if (domain && domain !== "ALL") {
            whereCondition.equipmentGroup = {
                equipmentGroupFamily: {
                    domain: domain
                }
            };
        }
        
        // Ajouter les autres queries
        whereCondition = { ...whereCondition, ...queries };

        let equipement = await equipementClient.findMany({
            where: whereCondition,
            include:{
                equipmentGroup: {
                    include: {
                        equipmentGroupFamily: true,
                    },
                },
                movement:true,
                maintenance:true,
                operations:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy: {
                title: 'asc'
            }
        });
        
        // Calculer nextMaintenance pour chaque équipement
        equipement = equipement.map(equipment => {
            const periodicityInDays = equipment.periodicity;
            let nextMaintenance;
            
            if (!equipment.lastMaintenance) {
                nextMaintenance = new Date(equipment.createdAt);
                nextMaintenance.setDate(nextMaintenance.getDate() + periodicityInDays);
            } else {
                nextMaintenance = new Date(equipment.lastMaintenance);
                nextMaintenance.setDate(nextMaintenance.getDate() + periodicityInDays);
            }
            
            return {
                ...equipment,
                nextMaintenance
            };
        });
        
        const total = await equipementClient.count({ 
            where: whereCondition 
        });
        
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total,
            data: equipement,
        };
    } catch (error) {
        console.log(error);
        return Errors(`${error}`, 'server');
    }
}

/**
 * Returns equipment based on the id and site
 * @param {*} id 
 * @param {*} siteId 
 * @returns 
 */
export const getEquipementHistoryService = async (id, siteId) =>{
    try {
        let equipment = await equipementClient.findFirst({
            where:{id, siteId, isActive:true}
        });

        return apiResponse(false, equipment);
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
// export const updateEquipementService = async (id, body) => {
//     const { numRef, title } = body;

//     // Vérification du numRef (en ignorant l'équipement actuel)
//     if (numRef) {
//         const existingRef = await equipementClient.findFirst({
//             where: { 
//                 numRef,
//                 id: { not: id } // Exclure l'équipement en cours de modification
//             }
//         });
//         if (existingRef) return Errors("Un équipement avec ce numéro de référence existe déjà", "numRef");
//     }

//     // Vérification du titre (en ignorant l'équipement actuel)
//     if (title) {
//         const existingTitle = await equipementClient.findFirst({
//             where: { 
//                 title,
//                 equipmentGroupId,
//                 isActive:true,
//                 id: { not: id } // Exclure l'équipement en cours de modification
//             }
//         });
//         if (existingTitle) return Errors("Un équipement avec ce nom existe déjà", "title");
//     }

//     try {
//         const updatedEquipement = await equipementClient.update({
//             where: { id },
//             data: body
//         });
//         return updatedEquipement;
//     } catch (error) {
//         console.error(error);
//         return Errors("Erreur lors de la mise à jour en base de données", 'server');
//     }
// }
export const updateEquipementService = async (id, body) => {
    const { numRef, title, equipmentGroupId } = body; // Ajoutez equipmentGroupId

    // Vérification du numRef (en ignorant l'équipement actuel)
    if (numRef) {
        const existingRef = await equipementClient.findFirst({
            where: { 
                numRef,
                id: { not: id },
                isActive: true // Ajoutez cette condition
            }
        });
        if (existingRef) return Errors("Un équipement avec ce numéro de référence existe déjà", "numRef");
    }

    // Vérification du titre (en ignorant l'équipement actuel)
    if (title && equipmentGroupId) { // Vérifiez que equipmentGroupId est défini
        const existingTitle = await equipementClient.findFirst({
            where: { 
                title,
                equipmentGroupId,
                isActive: true,
                id: { not: id }
            }
        });
        if (existingTitle) return Errors("Un équipement avec ce nom existe déjà", "title");
    }

    try {
        const updatedEquipement = await equipementClient.update({
            where: { id },
            data: body
        });
        return updatedEquipement;
    } catch (error) {
        console.error(error);
        return Errors("Erreur lors de la mise à jour en base de données", 'server');
    }
}

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteEquipmentService = async (id) =>{
    try {
        let exist = await equipementClient.findFirst({where:{id, isActive:true}});

        if(!exist){
            return apiResponse(true, [{msg:"Equipement does not exist", field:"id"}]);
        }


        let equipement = await equipementClient.update({
            where: {id},
            data:{
                isActive:false,
                title: `deleted__${exist.title}__${new Date().toISOString()}`
            }
        });

        return equipement
    } catch (error) {
        console.log(error);
        return Errors(`${error}`, 'server');
    }
}

/**
 * handle equipements data import
 * @param {*} filePath 
 */
export const importEquipementService = async (filePath) =>{
    try {
        const workbook = new ExcelJs.Workbook();
        await workbook.xlsx.readFile(filePath);

        const worksheet = workbook.getWorksheet(1);
        const rows = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                const rowData = row.values.slice(1);
                console.log(rowData[2]);
                rows.push({
                    name: rowData[2],
                });
            }
        });

        for (const row of rows){
            const lastEquipment = await equipementClient.findFirst({
                orderBy: { createdAt: 'desc' },
                select: { numRef: true }
            });
            let numRef = generateRefNum(lastEquipment);
            const equipement = await equipementClient.upsert({
                where: {
                    name: row.name,
                },
                update: {
                    name: row.name,
                },
                create: {name:row.name, numRef},
            })
        }
        console.log("Upload completed");
    } catch (error) {
        console.error(error)
        return Errors(`${error}`, 'server');
    }
}