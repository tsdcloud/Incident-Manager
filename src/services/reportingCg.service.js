import { prisma } from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';

const reportingCgClient = prisma.reportingCg;
const LIMIT = 100;

/**
 * Récupère le prix d'une pesée par son nom (insensible à la casse)
 */
const getWeighingPrice = async (name) => {
    const priceRecord = await prisma.weighingPrice.findFirst({
        where: {
            // name: { equals: name, mode: 'insensitive' },
            name: { equals: name },
            isActive: true
        }
    });
    return priceRecord ? priceRecord.price : 0;
};

/**
 * Calcule les montants totaux basés sur les quantités et les prix
 */
const calculateAmounts = async (data) => {
    const normalPrice = await getWeighingPrice("PESEE NORMALE");
    const testPrice = await getWeighingPrice("PESEE TEST");
    const offBridgePrice = await getWeighingPrice("HORS-PONT");

    const completeBySpecies = data.completeNumberWeighingsBySpecies ?? 0;
    const incompleteBySpecies = data.incompleteNumberWeighingsBySpecies ?? 0;
    // const completeToBeBilled = data.completeNumberWeighingsToBeBilled ?? 0;
    // const incompleteToBeBilled = data.incompleteNumberWeighingsToBeBilled ?? 0;
    const testBySpecies = data.testNumberWeighingsBySpecies ?? 0;
    const offBridge = data.offBridgeNumber ?? 0;

    const totalWeightAmount = (completeBySpecies + incompleteBySpecies) * normalPrice;
    // const totalWeightAmountToBeBilled = (completeToBeBilled + incompleteToBeBilled) * normalPrice;
    const totalTestWeightAmount = testBySpecies * testPrice;
    const totalOffBridgeAmount = offBridge * offBridgePrice;

    return {
        totalWeightAmount,
        // totalWeightAmountToBeBilled,
        totalTestWeightAmount,
        totalOffBridgeAmount
    };
};


// /**
//  * Création d'un rapport CG
//  */
/**
 * Convertit une date datetime-local en Date ISO-8601 valide pour Prisma
 */
const parseDateTimeLocal = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
        // Format datetime-local HTML : "2026-06-24T05:02"
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
            return new Date(value + ":00");
        }
        // Essayer de parser directement
        const date = new Date(value);
        if (!isNaN(date.getTime())) return date;
    }
    return null;
};

/**
 * Création d'un rapport CG
 */
export const createReportingCgService = async (body) => {
    const { operators, hses, attachments, consumables, createdBy, ...data } = body;

    if (!createdBy) {
        return apiResponse(true, [{ msg: "createdBy est requis", field: "createdBy" }]);
    }

    // Vérification CG entrant
    if (data.incomingCgId && prisma.incomingCg) {
        const incomingExists = await prisma.incomingCg.findFirst({
            where: { id: data.incomingCgId, isActive: true }
        });
        if (!incomingExists) {
            return apiResponse(true, [{ msg: "Le CG entrant spécifié n'existe pas", field: "incomingCgId" }]);
        }
    }

    // Génération du numéro de référence
    const lastRecord = await reportingCgClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });
    const numRef = generateRefNum(lastRecord);

    // Calcul des montants automatiques
    const amounts = await calculateAmounts(data);

    try {
        const reportingCg = await reportingCgClient.create({
            data: {
                ...data,
                numRef,
                createdBy,
                ...amounts,
                // Conversion des dates datetime-local
                firstWeighDate: parseDateTimeLocal(data.firstWeighDate),
                lastWeighDate: parseDateTimeLocal(data.lastWeighDate),
                operators: {
                    create: operators.map(operatorId => ({
                        operatorId,
                        createdBy
                    }))
                },
                hses: {
                    create: hses.map(hseId => ({
                        hseId,
                        createdBy
                    }))
                },
                attachments: attachments?.length ? {
                    create: attachments.map(att => ({
                        url: att.url,
                        filename: att.filename,
                        createdBy
                    }))
                } : undefined,
                outOfStockConsumableReportingCgs: consumables?.length ? {
                    create: consumables.map(consumableId => ({
                        consumableId,
                        createdBy
                    }))
                } : undefined
            },
            include: {
                operators: true,
                hses: true,
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                }
            }
        });
        return apiResponse(false, undefined, reportingCg);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

// /**
//  * Mise à jour d'un rapport CG
//  */

/**
 * Convertit une date datetime-local en Date ISO-8601 valide pour Prisma
 */

/**
 * Mise à jour d'un rapport CG
 */
export const updateReportingCgService = async (id, body) => {
    const { operators, hses, attachments, consumables, updatedBy, ...data } = body;

    const existing = await reportingCgClient.findUnique({
        where: { id, isActive: true }
    });
    if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

    // Conversion des dates datetime-local avant toute utilisation
    const parsedData = {
        ...data,
        firstWeighDate: parseDateTimeLocal(data.firstWeighDate),
        lastWeighDate: parseDateTimeLocal(data.lastWeighDate),
    };

    // Recalcul des montants si des champs de quantité sont présents
    const hasQuantityChanges = [
        'completeNumberWeighingsBySpecies',
        'incompleteNumberWeighingsBySpecies',
        // 'completeNumberWeighingsToBeBilled',
        // 'incompleteNumberWeighingsToBeBilled',
        'testNumberWeighingsBySpecies',
        'offBridgeNumber'
    ].some(key => data[key] !== undefined);

    let amounts = {};
    if (hasQuantityChanges) {
        const mergedData = { ...existing, ...parsedData };
        amounts = await calculateAmounts(mergedData);
    }

    try {
        const updated = await prisma.$transaction(async (tx) => {
            // Mise à jour des champs simples + montants + dates converties
            await tx.reportingCg.update({
                where: { id },
                data: { 
                    ...parsedData,  // ✅ Utilise parsedData avec les dates converties
                    ...amounts,
                    updatedBy: updatedBy || existing.createdBy 
                }
            });

            // Opérateurs
            if (operators !== undefined) {
                await tx.operatorReporting.deleteMany({ where: { reportingCgId: id } });
                if (operators.length) {
                    await tx.operatorReporting.createMany({
                        data: operators.map(operatorId => ({
                            operatorId,
                            reportingCgId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // HSE
            if (hses !== undefined) {
                await tx.hseReporting.deleteMany({ where: { reportingCgId: id } });
                if (hses.length) {
                    await tx.hseReporting.createMany({
                        data: hses.map(hseId => ({
                            hseId,
                            reportingCgId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Attachments
            if (attachments !== undefined) {
                await tx.attachmentReportingCg.deleteMany({ where: { reportingCgId: id } });
                if (attachments.length) {
                    await tx.attachmentReportingCg.createMany({
                        data: attachments.map(att => ({
                            url: att.url,
                            filename: att.filename,
                            reportingCgId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Consommables en rupture
            if (consumables !== undefined) {
                await tx.outOfStockConsumableReportingCg.deleteMany({ where: { reportingCgId: id } });
                if (consumables.length) {
                    await tx.outOfStockConsumableReportingCg.createMany({
                        data: consumables.map(consumableId => ({
                            consumableId,
                            reportingCgId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            return await tx.reportingCg.findUnique({
                where: { id },
                include: { 
                    operators: true, 
                    hses: true, 
                    attachments: true,
                    outOfStockConsumableReportingCgs: {
                        include: { consumable: true }
                    }
                }
            });
        });
        return apiResponse(false, undefined, updated);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};


/**
 * Récupération paginée avec filtres
 */
export const getAllReportingCgsService = async (params = {}) => {
    try {
        const { page = 1, limit = LIMIT, search, filter, value, restrictToUser, ...rest } = params;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        let where = { isActive: true };

        // ✅ Restriction automatique si OP ou HEAD_GUARD
        if (restrictToUser) {
            where.createdBy = restrictToUser;
        }

        // ── Recherche textuelle ────────────────────────────────────────────────
        if (search) {
            where = {
                ...where,
                OR: [
                    { numRef:               { contains: search } },
                    { incidentDescription:  { contains: search } },
                    { recipeCardNumber:     { contains: search } },
                    { productionDescription:{ contains: search } },
                    { createdBy:            { contains: search } },
                    { updatedBy:            { contains: search } },
                ],
            };
        }

        // ── Filtres structurés filter + value ──────────────────────────────────
        if (filter && value !== undefined && value !== '') {
            switch (filter) {
                case 'siteId':
                    where.siteId = value;
                    break;
                case 'shiftId':
                    where.shiftId = value;
                    break;
                case 'incomingCgId':
                    where.incomingCgId = value;
                    break;
                case 'createdBy':
                    if (!restrictToUser) {
                        where.createdBy = { contains: value };
                    }
                    break;
                case 'updatedBy':
                    where.updatedBy = { contains: value };
                    break;
                case 'isActive':
                    where.isActive = value === 'true';
                    break;
                case 'createdAt':
                case 'updatedAt': {
                    const [dateStart, dateEnd] = value.split(',');
                    if (dateStart && dateEnd) {
                        const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
                        const e = new Date(dateEnd);   e.setHours(23, 59, 59, 999);
                        where[filter] = { gte: s, lte: e };
                    } else if (dateStart) {
                        const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
                        where[filter] = { gte: s };
                    }
                    break;
                }
                default:
                    break;
            }
        }

        if (rest.siteId)       where.siteId       = rest.siteId;
        if (rest.shiftId)      where.shiftId      = rest.shiftId;
        if (rest.incomingCgId) where.incomingCgId = rest.incomingCgId;

        const total = await reportingCgClient.count({ where });
        const data  = await reportingCgClient.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: { 
                operators: true, 
                hses: true, 
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                }
            },
        });

        return apiResponse(false, undefined, {
            page: parseInt(page),
            totalPages: Math.ceil(total / take),
            total,
            data,
        });
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

/**
 * Alias pour la compatibilité avec les paramètres
 */

export const getReportingCgsByParamsService = async (params) => {
    return getAllReportingCgsService(params);
};

/**
 * Récupération d'un rapport par son ID
 */
export const getReportingCgByIdService = async (id) => {
    try {
        const reportingCg = await reportingCgClient.findUnique({
            where: { id, isActive: true },
            include: { 
                operators: true, 
                hses: true, 
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                }
            }
        });
        if (!reportingCg) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);
        return apiResponse(false, undefined, reportingCg);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

/**
 * Suppression logique d'un rapport
 */
export const deleteReportingCgService = async (id) => {
    try {
        const existing = await reportingCgClient.findUnique({
            where: { id, isActive: true }
        });
        if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

        await reportingCgClient.update({
            where: { id },
            data: {
                isActive: false,
                numRef: `deleted_${existing.numRef}_${Date.now()}`
            }
        });
        return apiResponse(false, undefined, {});
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

/**
 * Récupération des reportingCgs pour export Excel
 */
export const generateExcelReportingCgService = async (query) => {
    let { start, end, filter, value, filter2, value2, condition } = query;

    // ── Normalisation des dates ────────────────────────────────────────────────
    if (start && end) {
        start = new Date(start);
        start.setHours(0, 0, 0, 0);
        start = start.toISOString();

        end = new Date(end);
        end.setHours(23, 59, 59, 999);
        end = end.toISOString();
    }

    try {
        let where = { isActive: true };

        // ── Filtre par plage de dates (createdAt ou updatedAt) ─────────────────
        if (start && end) {
            const dateField = filter === 'updatedAt' ? 'updatedAt' : 'createdAt';
            where[dateField] = { gte: new Date(start), lte: new Date(end) };
        }

        // ── Filtres structurés filter + value ──────────────────────────────────
        if (filter && value !== undefined && value !== '') {
            switch (filter) {

                case 'siteId':
                    where.siteId = value;
                    break;

                case 'shiftId':
                    where.shiftId = value;
                    break;

                case 'incomingCgId':
                    where.incomingCgId = value;
                    break;

                case 'createdBy':
                    where.createdBy = { contains: value };
                    break;

                case 'updatedBy':
                    where.updatedBy = { contains: value };
                    break;

                case 'isActive':
                    where.isActive = value === 'true';
                    break;

                case 'createdAt':
                case 'updatedAt': {
                    const [dateStart, dateEnd] = value.split(',');
                    if (dateStart && dateEnd) {
                        const s = new Date(dateStart);
                        s.setHours(0, 0, 0, 0);
                        const e = new Date(dateEnd);
                        e.setHours(23, 59, 59, 999);
                        where[filter] = { gte: s, lte: e };
                    } else if (dateStart) {
                        const s = new Date(dateStart);
                        s.setHours(0, 0, 0, 0);
                        where[filter] = { gte: s };
                    }
                    break;
                }

                default:
                    break;
            }
        }

        // ✅ Filtre secondaire optionnel
        if (filter2 && value2) {
            switch (filter2) {
                case 'createdBy':
                    where.createdBy = condition === 'NOT'
                        ? { not: { contains: value2 } }
                        : { contains: value2 };
                    break;
                case 'updatedBy':
                    where.updatedBy = condition === 'NOT'
                        ? { not: { contains: value2 } }
                        : { contains: value2 };
                    break;
                default:
                    break;
            }
        }

        // Filtre date via start/end directs
        if (start && end && (filter === 'createdAt' || filter === 'updatedAt')) {
            const field = filter;
            where[field] = condition === 'NOT'
                ? { not: { gte: new Date(start), lte: new Date(end) } }
                : { gte: new Date(start), lte: new Date(end) };
        }

        const data = await reportingCgClient.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                operators:   true,
                hses:        true,
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                }
            },
        });

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
};