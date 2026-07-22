import { prisma } from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';

const consumableClient = prisma.consumable;
const LIMIT = 100;
const ORDER = 'asc';
const SORT_BY = 'name';

export const createConsumableService = async (body) => {
    const { numRef, name } = body;

    if (numRef) {
        const existing = await consumableClient.findFirst({
            where: { numRef, isActive: true }
        });
        if (existing) return apiResponse(true, [{ msg: 'NumRef existe déjà', field: 'numRef' }]);
    }

    if (name) {
        const existing = await consumableClient.findFirst({
            where: { name, isActive: true }
        });
        if (existing) return apiResponse(true, [{ msg: 'Nom existe déjà', field: 'name' }]);
    }

    const lastConsumable = await consumableClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });

    try {
        const generatedNumRef = generateRefNum(lastConsumable);
        const consumable = await consumableClient.create({
            data: { ...body, numRef: generatedNumRef }
        });
        return apiResponse(false, undefined, consumable);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const updateConsumableService = async (id, body) => {
    try {
        const consumable = await consumableClient.update({
            where: { isActive: true, id },
            data: body
        });
        return apiResponse(false, undefined, consumable);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getAllConsumablesService = async () => {
    try {
        const consumables = await consumableClient.findMany({
            where: { isActive: true }
        });
        return apiResponse(false, undefined, consumables);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getConsumablesByParamsService = async (params) => {
    try {
        const { page = 1, limit = LIMIT, sortBy = SORT_BY, order = ORDER, search, ...queries } = params;
        let whereConditions = { isActive: true };

        if (search) {
            whereConditions.name = { contains: search };
        }
        if (Object.keys(queries).length > 0) {
            whereConditions = { ...whereConditions, ...queries };
        }

        const consumables = await consumableClient.findMany({
            where: whereConditions,
            orderBy: { [sortBy]: order }
        });

        const total = await consumableClient.count({ where: whereConditions });

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: consumables
        });
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getConsumableByIdService = async (id) => {
    try {
        const consumable = await consumableClient.findUnique({
            where: { isActive: true, id }
        });
        if (!consumable) return apiResponse(true, [{ msg: 'Ce consommable n\'existe pas', field: 'id' }]);
        return apiResponse(false, undefined, consumable);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const deleteConsumableService = async (id) => {
    try {
        const existing = await consumableClient.findUnique({
            where: { isActive: true, id }
        });
        if (!existing) return apiResponse(true, [{ msg: 'Ce consommable n\'existe pas', field: 'id' }]);

        const consumable = await consumableClient.update({
            where: { id },
            data: {
                name: `deleted_${existing.name}_${new Date().toTimeString()}`,
                isActive: false
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};