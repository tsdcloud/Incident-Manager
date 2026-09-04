// import { prisma } from '../config.js';
// import { apiResponse } from '../utils/apiResponse.js';
// import { generateRefNum } from '../utils/utils.js';

// const watchReportClient = prisma.watchReport;
// const LIMIT = 100;

// // Récupère le prix d'une pesée par son nom (identique à reportingCg)
// const getWeighingPrice = async (name) => {
//     const priceRecord = await prisma.weighingPrice.findFirst({
//         where: { name, isActive: true }
//     });
//     return priceRecord ? priceRecord.price : 0;
// };

// // Calcule les montants totaux (identique à reportingCg)
// const calculateAmounts = async (data) => {
//     const normalPrice = await getWeighingPrice("PESEE NORMALE");
//     const testPrice = await getWeighingPrice("PESEE TEST");
//     const offBridgePrice = await getWeighingPrice("HORS-PONT");

//     const completeBySpecies = data.completeNumberWeighingsBySpecies ?? 0;
//     const incompleteBySpecies = data.incompleteNumberWeighingsBySpecies ?? 0;
//     const testBySpecies = data.testNumberWeighingsBySpecies ?? 0;
//     const offBridge = data.offBridgeNumber ?? 0;

//     const totalWeightAmount = (completeBySpecies + incompleteBySpecies) * normalPrice;
//     const totalTestWeightAmount = testBySpecies * testPrice;
//     const totalOffBridgeAmount = offBridge * offBridgePrice;

//     return {
//         totalWeightAmount,
//         totalTestWeightAmount,
//         totalOffBridgeAmount
//     };
// };

// // Convertit une date datetime-local en Date ISO-8601 valide pour Prisma
// const parseDateTimeLocal = (value) => {
//     if (!value) return null;
//     if (value instanceof Date) return value;
//     if (typeof value === 'string') {
//         if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
//             return new Date(value + ":00");
//         }
//         const date = new Date(value);
//         if (!isNaN(date.getTime())) return date;
//     }
//     return null;
// };

// // ------------------------------------------------------------
// // CREATE
// // ------------------------------------------------------------
// export const createWatchReportService = async (body) => {
//     const { operators, hses, attachments, consumables, createdBy, ...data } = body;

//     if (!createdBy) {
//         return apiResponse(true, [{ msg: "createdBy est requis", field: "createdBy" }]);
//     }

//     // Vérification que le reportingCg parent existe (si fourni)
//     if (data.reportingCgId) {
//         const parent = await prisma.reportingCg.findFirst({
//             where: { id: data.reportingCgId, isActive: true }
//         });
//         if (!parent) {
//             return apiResponse(true, [{ msg: "Le reportingCG parent n'existe pas", field: "reportingCgId" }]);
//         }
//     }

//     // Génération du numéro de référence
//     const lastRecord = await watchReportClient.findFirst({
//         orderBy: { createdAt: 'desc' },
//         select: { numRef: true }
//     });
//     const numRef = generateRefNum(lastRecord);

//     // Calcul des montants automatiques
//     const amounts = await calculateAmounts(data);

//     try {
//         const watchReport = await watchReportClient.create({
//             data: {
//                 ...data,
//                 numRef,
//                 createdBy,
//                 ...amounts,
//                 firstWeighDate: parseDateTimeLocal(data.firstWeighDate),
//                 lastWeighDate: parseDateTimeLocal(data.lastWeighDate),
//                 operators: {
//                     create: operators.map(operatorId => ({
//                         operatorId,
//                         createdBy
//                     }))
//                 },
//                 hses: {
//                     create: hses.map(hseId => ({
//                         hseId,
//                         createdBy
//                     }))
//                 },
//                 attachments: attachments?.length ? {
//                     create: attachments.map(att => ({
//                         url: att.url,
//                         filename: att.filename,
//                         createdBy
//                     }))
//                 } : undefined,
//                 outOfStockConsumableReportingCgs: consumables?.length ? {
//                     create: consumables.map(consumableId => ({
//                         consumableId,
//                         createdBy
//                     }))
//                 } : undefined
//             },
//             include: {
//                 operators: true,
//                 hses: true,
//                 attachments: true,
//                 outOfStockConsumableReportingCgs: {
//                     include: { consumable: true }
//                 },
//                 reportingCg: true
//             }
//         });
//         return apiResponse(false, undefined, watchReport);
//     } catch (error) {
//         console.error(error);
//         return apiResponse(true, [{ msg: error.message, field: "server" }]);
//     }
// };

// // ------------------------------------------------------------
// // UPDATE
// // ------------------------------------------------------------
// export const updateWatchReportService = async (id, body) => {
//     const { operators, hses, attachments, consumables, updatedBy, ...data } = body;

//     const existing = await watchReportClient.findUnique({
//         where: { id, isActive: true }
//     });
//     if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

//     const parsedData = {
//         ...data,
//         firstWeighDate: parseDateTimeLocal(data.firstWeighDate),
//         lastWeighDate: parseDateTimeLocal(data.lastWeighDate),
//     };

//     // Recalcul des montants si des champs de quantité sont présents
//     const hasQuantityChanges = [
//         'completeNumberWeighingsBySpecies',
//         'incompleteNumberWeighingsBySpecies',
//         'testNumberWeighingsBySpecies',
//         'offBridgeNumber'
//     ].some(key => data[key] !== undefined);

//     let amounts = {};
//     if (hasQuantityChanges) {
//         const mergedData = { ...existing, ...parsedData };
//         amounts = await calculateAmounts(mergedData);
//     }

//     try {
//         const updated = await prisma.$transaction(async (tx) => {
//             await tx.watchReport.update({
//                 where: { id },
//                 data: {
//                     ...parsedData,
//                     ...amounts,
//                     updatedBy: updatedBy || existing.createdBy
//                 }
//             });

//             // Opérateurs
//             if (operators !== undefined) {
//                 await tx.operatorReporting.deleteMany({ where: { watchReportId: id } });
//                 if (operators.length) {
//                     await tx.operatorReporting.createMany({
//                         data: operators.map(operatorId => ({
//                             operatorId,
//                             watchReportId: id,
//                             createdBy: updatedBy || existing.createdBy
//                         }))
//                     });
//                 }
//             }

//             // HSE
//             if (hses !== undefined) {
//                 await tx.hseReporting.deleteMany({ where: { watchReportId: id } });
//                 if (hses.length) {
//                     await tx.hseReporting.createMany({
//                         data: hses.map(hseId => ({
//                             hseId,
//                             watchReportId: id,
//                             createdBy: updatedBy || existing.createdBy
//                         }))
//                     });
//                 }
//             }

//             // Attachments
//             if (attachments !== undefined) {
//                 await tx.attachmentReportingCg.deleteMany({ where: { watchReportId: id } });
//                 if (attachments.length) {
//                     await tx.attachmentReportingCg.createMany({
//                         data: attachments.map(att => ({
//                             url: att.url,
//                             filename: att.filename,
//                             watchReportId: id,
//                             createdBy: updatedBy || existing.createdBy
//                         }))
//                     });
//                 }
//             }

//             // Consommables en rupture
//             if (consumables !== undefined) {
//                 await tx.outOfStockConsumableReportingCg.deleteMany({ where: { watchReportId: id } });
//                 if (consumables.length) {
//                     await tx.outOfStockConsumableReportingCg.createMany({
//                         data: consumables.map(consumableId => ({
//                             consumableId,
//                             watchReportId: id,
//                             createdBy: updatedBy || existing.createdBy
//                         }))
//                     });
//                 }
//             }

//             return await tx.watchReport.findUnique({
//                 where: { id },
//                 include: {
//                     operators: true,
//                     hses: true,
//                     attachments: true,
//                     outOfStockConsumableReportingCgs: {
//                         include: { consumable: true }
//                     },
//                     reportingCg: true
//                 }
//             });
//         });
//         return apiResponse(false, undefined, updated);
//     } catch (error) {
//         console.error(error);
//         return apiResponse(true, [{ msg: error.message, field: "server" }]);
//     }
// };

// // ------------------------------------------------------------
// // GET ALL (avec pagination et filtres)
// // ------------------------------------------------------------
// export const getAllWatchReportsService = async (params = {}) => {
//     try {
//         const { page = 1, limit = LIMIT, search, filter, value, ...rest } = params;
//         const skip = (parseInt(page) - 1) * parseInt(limit);
//         const take = parseInt(limit);

//         let where = { isActive: true };

//         if (search) {
//             where = {
//                 ...where,
//                 OR: [
//                     { numRef:               { contains: search } },
//                     { incidentDescription:  { contains: search } },
//                     { recipeCardNumber:     { contains: search } },
//                     { productionDescription:{ contains: search } },
//                     { createdBy:            { contains: search } },
//                     { updatedBy:            { contains: search } },
//                 ],
//             };
//         }

//         if (filter && value !== undefined && value !== '') {
//             switch (filter) {
//                 case 'siteId':
//                     where.siteId = value;
//                     break;
//                 case 'shiftId':
//                     where.shiftId = value;
//                     break;
//                 case 'incomingCgId':
//                     where.incomingCgId = value;
//                     break;
//                 case 'numRef':
//                     where.numRef = { contains: value };
//                     break;
//                 case 'createdBy':
//                     where.createdBy = { contains: value };
//                     break;
//                 case 'updatedBy':
//                     where.updatedBy = { contains: value };
//                     break;
//                 case 'isActive':
//                     where.isActive = value === 'true';
//                     break;
//                 case 'createdAt':
//                 case 'updatedAt': {
//                     const [dateStart, dateEnd] = value.split(',');
//                     if (dateStart && dateEnd) {
//                         const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
//                         const e = new Date(dateEnd);   e.setHours(23, 59, 59, 999);
//                         where[filter] = { gte: s, lte: e };
//                     } else if (dateStart) {
//                         const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
//                         where[filter] = { gte: s };
//                     }
//                     break;
//                 }
//                 default:
//                     break;
//             }
//         }

//         // Filtres supplémentaires passés en query
//         if (rest.siteId)       where.siteId       = rest.siteId;
//         if (rest.shiftId)      where.shiftId      = rest.shiftId;
//         if (rest.incomingCgId) where.incomingCgId = rest.incomingCgId;

//         const total = await watchReportClient.count({ where });
//         const data  = await watchReportClient.findMany({
//             where,
//             skip,
//             take,
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 operators: true,
//                 hses: true,
//                 attachments: true,
//                 outOfStockConsumableReportingCgs: {
//                     include: { consumable: true }
//                 },
//                 reportingCg: true
//             },
//         });

//         return apiResponse(false, undefined, {
//             page: parseInt(page),
//             totalPages: Math.ceil(total / take),
//             total,
//             data,
//         });
//     } catch (error) {
//         console.error(error);
//         return apiResponse(true, [{ msg: error.message, field: "server" }]);
//     }
// };

// // ------------------------------------------------------------
// // GET BY ID
// // ------------------------------------------------------------
// export const getWatchReportByIdService = async (id) => {
//     try {
//         const watchReport = await watchReportClient.findUnique({
//             where: { id, isActive: true },
//             include: {
//                 operators: true,
//                 hses: true,
//                 attachments: true,
//                 outOfStockConsumableReportingCgs: {
//                     include: { consumable: true }
//                 },
//                 // ✅ Nécessaire pour afficher le numRef du reportingCg parent
//                 // dans la section "Informations générales" du PDF de quart.
//                 reportingCg: true
//             }
//         });
//         if (!watchReport) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);
//         return apiResponse(false, undefined, watchReport);
//     } catch (error) {
//         console.error(error);
//         return apiResponse(true, [{ msg: error.message, field: "server" }]);
//     }
// };

// // ------------------------------------------------------------
// // DELETE (soft delete)
// // ------------------------------------------------------------
// export const deleteWatchReportService = async (id) => {
//     try {
//         const existing = await watchReportClient.findUnique({
//             where: { id, isActive: true }
//         });
//         if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

//         await watchReportClient.update({
//             where: { id },
//             data: {
//                 isActive: false,
//                 numRef: `deleted_${existing.numRef}_${Date.now()}`
//             }
//         });
//         return apiResponse(false, undefined, {});
//     } catch (error) {
//         console.error(error);
//         return apiResponse(true, [{ msg: error.message, field: "server" }]);
//     }
// };

// // ------------------------------------------------------------
// // EXPORT EXCEL
// // ------------------------------------------------------------
// export const generateExcelWatchReportService = async (query) => {
//     let { start, end, filter, value, filter2, value2, condition } = query;

//     if (start && end) {
//         start = new Date(start);
//         start.setHours(0, 0, 0, 0);
//         start = start.toISOString();

//         end = new Date(end);
//         end.setHours(23, 59, 59, 999);
//         end = end.toISOString();
//     }

//     try {
//         let where = { isActive: true };

//         if (start && end) {
//             const dateField = filter === 'updatedAt' ? 'updatedAt' : 'createdAt';
//             where[dateField] = { gte: new Date(start), lte: new Date(end) };
//         }

//         if (filter && value !== undefined && value !== '') {
//             switch (filter) {
//                 case 'siteId':
//                     where.siteId = value;
//                     break;
//                 case 'shiftId':
//                     where.shiftId = value;
//                     break;
//                 case 'incomingCgId':
//                     where.incomingCgId = value;
//                     break;
//                 case 'numRef':
//                     where.numRef = { contains: value };
//                     break;
//                 case 'createdBy':
//                     where.createdBy = { contains: value };
//                     break;
//                 case 'updatedBy':
//                     where.updatedBy = { contains: value };
//                     break;
//                 case 'isActive':
//                     where.isActive = value === 'true';
//                     break;
//                 case 'createdAt':
//                 case 'updatedAt': {
//                     const [dateStart, dateEnd] = value.split(',');
//                     if (dateStart && dateEnd) {
//                         const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
//                         const e = new Date(dateEnd);   e.setHours(23, 59, 59, 999);
//                         where[filter] = { gte: s, lte: e };
//                     } else if (dateStart) {
//                         const s = new Date(dateStart); s.setHours(0, 0, 0, 0);
//                         where[filter] = { gte: s };
//                     }
//                     break;
//                 }
//                 default:
//                     break;
//             }
//         }

//         if (filter2 && value2) {
//             switch (filter2) {
//                 case 'createdBy':
//                     where.createdBy = condition === 'NOT'
//                         ? { not: { contains: value2 } }
//                         : { contains: value2 };
//                     break;
//                 case 'updatedBy':
//                     where.updatedBy = condition === 'NOT'
//                         ? { not: { contains: value2 } }
//                         : { contains: value2 };
//                     break;
//                 default:
//                     break;
//             }
//         }

//         const data = await watchReportClient.findMany({
//             where,
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 operators:   true,
//                 hses:        true,
//                 attachments: true,
//                 outOfStockConsumableReportingCgs: {
//                     include: { consumable: true }
//                 },
//                 reportingCg: true
//             },
//         });

//         return data;
//     } catch (error) {
//         console.error(error);
//         throw new Error(`${error}`);
//     }
// };
import { prisma } from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';

const watchReportClient = prisma.watchReport;
const LIMIT = 100;

// Récupère le prix d'une pesée par son nom (identique à reportingCg)
const getWeighingPrice = async (name) => {
    const priceRecord = await prisma.weighingPrice.findFirst({
        where: { name, isActive: true }
    });
    return priceRecord ? priceRecord.price : 0;
};

// Calcule les montants totaux (identique à reportingCg)
const calculateAmounts = async (data) => {
    const normalPrice = await getWeighingPrice("PESEE NORMALE");
    const testPrice = await getWeighingPrice("PESEE TEST");
    const offBridgePrice = await getWeighingPrice("HORS-PONT");

    const completeBySpecies = data.completeNumberWeighingsBySpecies ?? 0;
    const incompleteBySpecies = data.incompleteNumberWeighingsBySpecies ?? 0;
    const testBySpecies = data.testNumberWeighingsBySpecies ?? 0;
    const offBridge = data.offBridgeNumber ?? 0;

    const totalWeightAmount = (completeBySpecies + incompleteBySpecies) * normalPrice;
    const totalTestWeightAmount = testBySpecies * testPrice;
    const totalOffBridgeAmount = offBridge * offBridgePrice;

    return {
        totalWeightAmount,
        totalTestWeightAmount,
        totalOffBridgeAmount
    };
};

// Convertit une date datetime-local en Date ISO-8601 valide pour Prisma
const parseDateTimeLocal = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
            return new Date(value + ":00");
        }
        const date = new Date(value);
        if (!isNaN(date.getTime())) return date;
    }
    return null;
};

// ------------------------------------------------------------
// CREATE
// ------------------------------------------------------------
export const createWatchReportService = async (body) => {
    const { operators, hses, attachments, consumables, createdBy, ...data } = body;

    if (!createdBy) {
        return apiResponse(true, [{ msg: "createdBy est requis", field: "createdBy" }]);
    }

    // Vérification que le reportingCg parent existe (si fourni)
    if (data.reportingCgId) {
        const parent = await prisma.reportingCg.findFirst({
            where: { id: data.reportingCgId, isActive: true }
        });
        if (!parent) {
            return apiResponse(true, [{ msg: "Le reportingCG parent n'existe pas", field: "reportingCgId" }]);
        }

        // ✅ NOUVEAU : reportingCgId est unique sur watchReport (relation 1-1).
        // Sans ce contrôle, une seconde tentative de création sur le même CG
        // (double-clic, requête rejouée, etc.) provoque une erreur Prisma brute
        // (contrainte @unique) au lieu d'un message clair pour l'utilisateur.
        const existingWatchReport = await watchReportClient.findFirst({
            where: { reportingCgId: data.reportingCgId, isActive: true }
        });
        if (existingWatchReport) {
            return apiResponse(true, [{
                msg: "Un Rapport de Quart existe déjà pour ce reporting CG",
                field: "reportingCgId"
            }]);
        }
    }

    // Génération du numéro de référence
    const lastRecord = await watchReportClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });
    const numRef = generateRefNum(lastRecord);

    // Calcul des montants automatiques
    const amounts = await calculateAmounts(data);

    try {
        const watchReport = await watchReportClient.create({
            data: {
                ...data,
                numRef,
                createdBy,
                ...amounts,
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
                },
                reportingCg: true
            }
        });
        return apiResponse(false, undefined, watchReport);
    } catch (error) {
        console.error(error);

        // ✅ Filet de sécurité supplémentaire : si la contrainte @unique
        // est malgré tout atteinte (course entre deux requêtes concurrentes
        // passées toutes deux le contrôle ci-dessus), on renvoie un message
        // clair plutôt que le code d'erreur Prisma brut (P2002).
        if (error.code === 'P2002' && error.meta?.target?.includes('reportingCgId')) {
            return apiResponse(true, [{
                msg: "Un Rapport de Quart existe déjà pour ce reporting CG",
                field: "reportingCgId"
            }]);
        }

        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

// ------------------------------------------------------------
// UPDATE
// ------------------------------------------------------------
export const updateWatchReportService = async (id, body) => {
    const { operators, hses, attachments, consumables, updatedBy, ...data } = body;

    const existing = await watchReportClient.findUnique({
        where: { id, isActive: true }
    });
    if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

    const parsedData = {
        ...data,
        firstWeighDate: parseDateTimeLocal(data.firstWeighDate),
        lastWeighDate: parseDateTimeLocal(data.lastWeighDate),
    };

    // Recalcul des montants si des champs de quantité sont présents
    const hasQuantityChanges = [
        'completeNumberWeighingsBySpecies',
        'incompleteNumberWeighingsBySpecies',
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
            await tx.watchReport.update({
                where: { id },
                data: {
                    ...parsedData,
                    ...amounts,
                    updatedBy: updatedBy || existing.createdBy
                }
            });

            // Opérateurs
            if (operators !== undefined) {
                await tx.operatorReporting.deleteMany({ where: { watchReportId: id } });
                if (operators.length) {
                    await tx.operatorReporting.createMany({
                        data: operators.map(operatorId => ({
                            operatorId,
                            watchReportId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // HSE
            if (hses !== undefined) {
                await tx.hseReporting.deleteMany({ where: { watchReportId: id } });
                if (hses.length) {
                    await tx.hseReporting.createMany({
                        data: hses.map(hseId => ({
                            hseId,
                            watchReportId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Attachments
            if (attachments !== undefined) {
                await tx.attachmentReportingCg.deleteMany({ where: { watchReportId: id } });
                if (attachments.length) {
                    await tx.attachmentReportingCg.createMany({
                        data: attachments.map(att => ({
                            url: att.url,
                            filename: att.filename,
                            watchReportId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Consommables en rupture
            if (consumables !== undefined) {
                await tx.outOfStockConsumableReportingCg.deleteMany({ where: { watchReportId: id } });
                if (consumables.length) {
                    await tx.outOfStockConsumableReportingCg.createMany({
                        data: consumables.map(consumableId => ({
                            consumableId,
                            watchReportId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            return await tx.watchReport.findUnique({
                where: { id },
                include: {
                    operators: true,
                    hses: true,
                    attachments: true,
                    outOfStockConsumableReportingCgs: {
                        include: { consumable: true }
                    },
                    reportingCg: true
                }
            });
        });
        return apiResponse(false, undefined, updated);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

// ------------------------------------------------------------
// GET ALL (avec pagination et filtres)
// ------------------------------------------------------------
export const getAllWatchReportsService = async (params = {}) => {
    try {
        const { page = 1, limit = LIMIT, search, filter, value, ...rest } = params;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        let where = { isActive: true };

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
                case 'reportingCgId':
                    where.reportingCgId = value;
                    break;
                case 'numRef':
                    where.numRef = { contains: value };
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

        // Filtres supplémentaires passés en query (ex: ?reportingCgId=... utilisé
        // par ReportingCgDetails pour retrouver le Watch Report d'un CG donné)
        if (rest.siteId)       where.siteId       = rest.siteId;
        if (rest.shiftId)      where.shiftId      = rest.shiftId;
        if (rest.incomingCgId) where.incomingCgId = rest.incomingCgId;
        if (rest.reportingCgId) where.reportingCgId = rest.reportingCgId;

        const total = await watchReportClient.count({ where });
        const data  = await watchReportClient.findMany({
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
                },
                reportingCg: true
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

// ------------------------------------------------------------
// GET BY ID
// ------------------------------------------------------------
export const getWatchReportByIdService = async (id) => {
    try {
        const watchReport = await watchReportClient.findUnique({
            where: { id, isActive: true },
            include: {
                operators: true,
                hses: true,
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                },
                reportingCg: true
            }
        });
        if (!watchReport) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);
        return apiResponse(false, undefined, watchReport);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

// ------------------------------------------------------------
// DELETE (soft delete)
// ------------------------------------------------------------
export const deleteWatchReportService = async (id) => {
    try {
        const existing = await watchReportClient.findUnique({
            where: { id, isActive: true }
        });
        if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

        await watchReportClient.update({
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

// ------------------------------------------------------------
// EXPORT EXCEL
// ------------------------------------------------------------
export const generateExcelWatchReportService = async (query) => {
    let { start, end, filter, value, filter2, value2, condition } = query;

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

        if (start && end) {
            const dateField = filter === 'updatedAt' ? 'updatedAt' : 'createdAt';
            where[dateField] = { gte: new Date(start), lte: new Date(end) };
        }

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
                case 'numRef':
                    where.numRef = { contains: value };
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

        const data = await watchReportClient.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                operators:   true,
                hses:        true,
                attachments: true,
                outOfStockConsumableReportingCgs: {
                    include: { consumable: true }
                },
                reportingCg: true
            },
        });

        return data;
    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
};