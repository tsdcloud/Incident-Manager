import { prisma } from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';

const weighingPriceClient = prisma.weighingPrice;
const LIMIT = 100;
const ORDER = 'asc';
const SORT_BY = 'name';

export const createWeighingPriceService = async (body) => {
    const { numRef, name } = body;

    if (numRef) {
        const existing = await weighingPriceClient.findFirst({
            where: { numRef, isActive: true }
        });
        if (existing) return apiResponse(true, [{ msg: 'NumRef existe déjà', field: 'numRef' }]);
    }

    if (name) {
        const existing = await weighingPriceClient.findFirst({
            where: { name, isActive: true }
        });
        if (existing) return apiResponse(true, [{ msg: 'Nom existe déjà', field: 'name' }]);
    }
    const price = Number(body.price);
    if (Number.isNaN(price)) {
    return apiResponse(true, [{ msg: "Le prix doit être un nombre valide", field: "price" }]);
    }

    const lastWeighingPrice = await weighingPriceClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });

    try {
        const generatedNumRef = generateRefNum(lastWeighingPrice);
        const weighingPrice = await weighingPriceClient.create({
            data: { ...body, price, numRef: generatedNumRef }
        });
        return apiResponse(false, undefined, weighingPrice);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const updateWeighingPriceService = async (id, body) => {
    try {
        const price = Number(body.price);
        if (Number.isNaN(price)) {
            return apiResponse(true, [{ msg: "Le prix doit être un nombre valide", field: "price" }]);
        }
        body.price = price;

        const weighingPrice = await weighingPriceClient.update({
            where: { isActive: true, id },
            data: body
        });
        return apiResponse(false, undefined, weighingPrice);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getAllWeighingPricesService = async () => {
    try {
        const weighingPrices = await weighingPriceClient.findMany({
            where: { isActive: true }
        });
        return apiResponse(false, undefined, weighingPrices);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getWeighingPricesByParamsService = async (params) => {
    try {
        const { page = 1, limit = LIMIT, sortBy = SORT_BY, order = ORDER, search, ...queries } = params;
        let whereConditions = { isActive: true };

        if (search) {
            whereConditions.name = { contains: search };
        }
        if (Object.keys(queries).length > 0) {
            whereConditions = { ...whereConditions, ...queries };
        }

        const weighingPrices = await weighingPriceClient.findMany({
            where: whereConditions,
            orderBy: { [sortBy]: order }
        });

        const total = await weighingPriceClient.count({ where: whereConditions });

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / LIMIT),
            total,
            data: weighingPrices
        });
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const getWeighingPriceByIdService = async (id) => {
    try {
        const weighingPrice = await weighingPriceClient.findUnique({
            where: { isActive: true, id }
        });
        if (!weighingPrice) return apiResponse(true, [{ msg: 'Ce prix à la pesée n\'existe pas', field: 'id' }]);
        return apiResponse(false, undefined, weighingPrice);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{ msg: error, field: 'server' }]);
    }
};

export const deleteWeighingPriceService = async (id) => {
    try {
        const existing = await weighingPriceClient.findUnique({
            where: { isActive: true, id }
        });
        if (!existing) return apiResponse(true, [{ msg: 'Ce prix à la pesée n\'existe pas', field: 'id' }]);

        const weighingPrice = await weighingPriceClient.update({
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