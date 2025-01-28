import {prisma} from '../config.js';
const equipementClient = prisma.equipement;

const LIMIT = 100;
const ORDER ="asc";
const SORT_BY = "name";

/**
 * Create qn equipement
 * @param body 
 * @returns 
 */
export const createEquipementService = async (body)=>{
    try {
        const lastEquipment = await equipementClient.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { numRef: true }
        });

        const date = new Date();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        const prefix = `${mm}${yy}`;
        const nextNum = lastEquipment ? parseInt(lastEquipment.numRef.slice(-4)) + 1 : 1;
        const numRef = `${prefix}${String(nextNum).padStart(4, '0')}`;
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