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

    let {numRef, name} = body;


    if(numRef){
        let equipement = await equipementClient.findFirst({
            where:{numRef, isActive:true}
        });
        if (equipement) return apiResponse(true, [{msg: "NumRef already exist", field: "numRef"}]);;
    }

    if(name){
        let equipement = await equipementClient.findFirst({
            where:{name, isActive:true}
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
                equipmentGroup:true,
                movement:true,
                maintenance:true,
                operations:true
            }
        });

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
export const getSiteEquipmentsService = async(siteId) => {
    try {
        let equipements = await equipementClient.findMany({
            where:{
                siteId, isActive:true
            },
            include:{
                equipmentGroup:true,
                movement:true,
                maintenance:true,
                operations:true
            },
            orderBy:{
                title:"asc"
            }
        });
        console.log(equipements)
        return apiResponse(false, undefined, equipements);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
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
        });
        return equipement;
    } catch (error) {
        console.log(error);
        return Errors(`${error}`, 'server');
    }
}

/**
 * Get equipments by params
 * @param request 
 * @returns 
 */
export const getEquipementByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let equipement = await equipementClient.findMany({
            where:!search ? {isActive:true, ...queries} : {
                OR:[
                    {title:{contains:search}},
                    {numRef:{contains:search}}
                ],
                isActive:true
            },
            skip: parseInt(skip),
            take: parseInt(limit),
            orderBy:{
                title:'asc'
            }
        });
        const total = await equipementClient.count();
        return search ? {data: equipement} :{
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
export const updateEquipementService = async (id, body) =>{
    let {numRef, name} = body;

    if(numRef){
        let equipement = await equipementClient.findFirst({
            where:{numRef}
        });
        if (equipement) return Errors("equipement with this ref number already exist", "numRef");
    }

    if(name){
        let equipement = await equipementClient.findFirst({
            where:{name}
        })
        if (equipement) return Errors("equipement with this name already exist", "name");
    }

    try {
        let equipement = await equipementClient.update({
            where:{id},
            data:body
        });
        return equipement;
    } catch (error) {
        console.log(error)
        return Errors(`${error}`, 'server');
    }
}

/**
 * 
 * @param id 
 * @returns 
 */
export const deleteEquipmentService = async (id) =>{
    try {
        let exist = await equipementClient.findFirst({where:{id}});

        if(!exist){
            return Errors("Equipement does not exist", "id");
        }


        let equipement = await equipementClient.update({
            where: {id},
            data:{
                isActive:false,
                name: `deleted__${exist.name}__${new Date().toISOString()}`
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