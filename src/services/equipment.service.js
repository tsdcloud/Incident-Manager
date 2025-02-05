import {prisma} from '../config.js';
import ExcelJs from 'exceljs';
import { generateRefNum } from '../utils/utils.js';

const equipementClient = prisma.equipement;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create an equipement
 * @param body 
 * @returns 
 */
export const createEquipementService = async (body)=>{
    try {
        const lastEquipment = await equipementClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });       
        const numRef = generateRefNum(lastEquipment);
        let equipement = await equipementClient.create({
            data:{...body, numRef}
        });
        return equipement;
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
    }
}


/**
 * 
 * @returns 
 */
export const getAllEquipmentService = async(body) =>{
    const page = 1;
    const skip = (page - 1) * LIMIT;

    try {
        let equipements = await equipementClient.findMany({
            where:{isActive:true},
            skip: parseInt(skip),
            take: parseInt(LIMIT),
            orderBy:{
                createdAt:'desc'
            }
        });
        const total = await equipementClient.count();
        return {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: equipements,
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
export const getEquipementByIdService = async(id) =>{
    try {
        let equipement = await equipementClient.findFirst({
            where:{id, isActive: true},
        });
        return equipement;
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
export const getEquipementByParams = async (request) =>{
    const { page = 1, limit = LIMIT, sortBy = SORT_BY, order=ORDER, search, ...queries } = request; 
    const skip = (page - 1) * limit;
    try {
        let equipement = await equipementClient.findMany({
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
                createdAt:'desc'
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
    try {
        let equipement = await equipementClient.update({
            where:{id},
            data:body
        });
        return equipement;
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
export const deleteEquipmentService = async (id) =>{
    try {
        let equipement = await equipementClient.update({
            where: {id},
            data:{
                isActive:false
            }
        });
        return equipement
    } catch (error) {
        console.log(error);
        throw new Error(`${error}`);
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
        console.log("Upload completed")
    } catch (error) {
        console.error(error)
        throw new Error(`${error}`)
    }
}