import { prisma } from '../config.js';
import { apiResponse } from '../utils/apiResponse.js';
import { generateRefNum } from '../utils/utils.js';

const reportingSupervisoryClient = prisma.reportingSupervisory;
const LIMIT = 100;

/**
 * Création d'un rapport Superviseur
 */
export const createReportingSupervisoryService = async (body) => {
    const { chargers, shippers, thirdParties, ships, products, incidents, attachments, createdBy, ...data } = body;

    if (!createdBy) {
        return apiResponse(true, [{ msg: "createdBy est requis", field: "createdBy" }]);
    }

    // Vérification Superviseur entrant (si modèle existe)
    if (data.incomingSupervisoryId && prisma.incomingSupervisory) {
        const incomingExists = await prisma.incomingSupervisory.findFirst({
            where: { id: data.incomingSupervisoryId, isActive: true }
        });
        if (!incomingExists) {
            return apiResponse(true, [{ msg: "Le Superviseur entrant spécifié n'existe pas", field: "incomingSupervisoryId" }]);
        }
    }

    // Vérification des navires (si fournis)
    if (ships?.length && prisma.ship) {
        for (const shipId of ships) {
            const shipExists = await prisma.ship.findFirst({
                where: { id: shipId, isActive: true }
            });
            if (!shipExists) {
                return apiResponse(true, [{ msg: `Le navire avec l'ID ${shipId} n'existe pas`, field: "ships" }]);
            }
        }
    }

    // Vérification des produits (si fournis)
    if (products?.length && prisma.product) {
        for (const productId of products) {
            const productExists = await prisma.product.findFirst({
                where: { id: productId, isActive: true }
            });
            if (!productExists) {
                return apiResponse(true, [{ msg: `Le produit avec l'ID ${productId} n'existe pas`, field: "products" }]);
            }
        }
    }

    // Génération du numéro de référence
    const lastRecord = await reportingSupervisoryClient.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { numRef: true }
    });
    const numRef = generateRefNum(lastRecord);

    try {
        const reportingSupervisory = await reportingSupervisoryClient.create({
            data: {
                ...data,
                numRef,
                createdBy,
                chargers: {
                    create: chargers?.map(chargerId => ({
                        chargerId,
                        createdBy
                    })) || []
                },
                shippers: {
                    create: shippers?.map(shipperId => ({
                        shipperId,
                        createdBy
                    })) || []
                },
                thirdParties: {
                    create: thirdParties?.map(thirdPartyId => ({
                        thirdPartyId,
                        createdBy
                    })) || []
                },
                ships: {
                    create: ships?.map(shipId => ({
                        shipId,
                        createdBy
                    })) || []
                },
                products: {
                    create: products?.map(productId => ({
                        productId,
                        createdBy
                    })) || []
                },
                incidents: {
                    create: incidents?.map(inc => ({
                        equipment: inc.equipment,
                        breakdown: inc.breakdown,
                        typeFailure: inc.typeFailure,
                        downtime: inc.downtime,
                        status: inc.status,
                        managerFailure: inc.managerFailure,
                        createdBy
                    })) || []
                },
                attachments: attachments?.length ? {
                    create: attachments.map(att => ({
                        url: att.url,
                        filename: att.filename,
                        createdBy
                    }))
                } : undefined
            },
            include: {
                chargers: true,
                shippers: true,
                thirdParties: true,
                ships: { include: { ship: true } },
                products: { include: { product: true } },
                incidents: true,
                attachments: true
            }
        });
        return apiResponse(false, undefined, reportingSupervisory);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

/**
 * Mise à jour d'un rapport Superviseur
 */
export const updateReportingSupervisoryService = async (id, body) => {
    const { chargers, shippers, thirdParties, ships, products, incidents, attachments, updatedBy, ...data } = body;

    const existing = await reportingSupervisoryClient.findUnique({
        where: { id, isActive: true }
    });
    if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

    try {
        const updated = await prisma.$transaction(async (tx) => {
            // Mise à jour des champs simples
            await tx.reportingSupervisory.update({
                where: { id },
                data: { ...data, updatedBy: updatedBy || existing.createdBy }
            });

            // Chargers
            if (chargers !== undefined) {
                await tx.chargerReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (chargers.length) {
                    await tx.chargerReporting.createMany({
                        data: chargers.map(chargerId => ({
                            chargerId,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Shippers
            if (shippers !== undefined) {
                await tx.shipperReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (shippers.length) {
                    await tx.shipperReporting.createMany({
                        data: shippers.map(shipperId => ({
                            shipperId,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // ThirdParties
            if (thirdParties !== undefined) {
                await tx.thirdPartyReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (thirdParties.length) {
                    await tx.thirdPartyReporting.createMany({
                        data: thirdParties.map(thirdPartyId => ({
                            thirdPartyId,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Ships
            if (ships !== undefined) {
                await tx.shipReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (ships.length) {
                    await tx.shipReporting.createMany({
                        data: ships.map(shipId => ({
                            shipId,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Products
            if (products !== undefined) {
                await tx.productReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (products.length) {
                    await tx.productReporting.createMany({
                        data: products.map(productId => ({
                            productId,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Incidents
            if (incidents !== undefined) {
                await tx.incidentReporting.deleteMany({ where: { reportingSupervisoryId: id } });
                if (incidents.length) {
                    await tx.incidentReporting.createMany({
                        data: incidents.map(inc => ({
                            equipment: inc.equipment,
                            breakdown: inc.breakdown,
                            typeFailure: inc.typeFailure,
                            downtime: inc.downtime,
                            status: inc.status,
                            managerFailure: inc.managerFailure,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            // Attachments
            if (attachments !== undefined) {
                await tx.attachmentReportingSupervisory.deleteMany({ where: { reportingSupervisoryId: id } });
                if (attachments.length) {
                    await tx.attachmentReportingSupervisory.createMany({
                        data: attachments.map(att => ({
                            url: att.url,
                            filename: att.filename,
                            reportingSupervisoryId: id,
                            createdBy: updatedBy || existing.createdBy
                        }))
                    });
                }
            }

            return await tx.reportingSupervisory.findUnique({
                where: { id },
                include: {
                    chargers: true,
                    shippers: true,
                    thirdParties: true,
                    ships: { include: { ship: true } },
                    products: { include: { product: true } },
                    incidents: true,
                    attachments: true
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
// export const getAllReportingSupervisorysService = async (params = {}) => {
//     try {
//         const { page = 1, limit = LIMIT, search, filter, value, ...rest } = params;
//         const skip = (parseInt(page) - 1) * parseInt(limit);
//         const take = parseInt(limit);

//         let where = { isActive: true };

//         // ── Recherche textuelle libre ──────────────────────────────────────────
//         if (search) {
//             where = {
//                 ...where,
//                 OR: [
//                     { numRef: { contains: search } },
//                     { productionNote: { contains: search } },
//                     { teamManagementFeedback: { contains: search } },
//                     { titleWorkProgress: { contains: search } },
//                     { commentWorkProgress: { contains: search } },
//                     { incidentNote: { contains: search } },
//                     { createdBy: { contains: search } },
//                     { updatedBy: { contains: search } },
//                 ],
//             };
//         }

//         // ── Filtres structurés via filter + value ──────────────────────────────
//         if (filter && value !== undefined && value !== '') {
//             switch (filter) {
//                 case 'shiftId':
//                     where.shiftId = value;
//                     break;

//                 case 'incomingSupervisoryId':
//                     where.incomingSupervisoryId = value;
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
//                     const [start, end] = value.split(',');
//                     if (start && end) {
//                         where[filter] = {
//                             gte: new Date(start),
//                             lte: new Date(new Date(end).setHours(23, 59, 59, 999)),
//                         };
//                     } else if (start) {
//                         where[filter] = { gte: new Date(start) };
//                     }
//                     break;
//                 }

//                 default:
//                     break;
//             }
//         }

//         // ── Compatibilité ancienne API (params directs) ────────────────────────
//         if (rest.shiftId) where.shiftId = rest.shiftId;
//         if (rest.incomingSupervisoryId) where.incomingSupervisoryId = rest.incomingSupervisoryId;

//         const total = await reportingSupervisoryClient.count({ where });
//         const data = await reportingSupervisoryClient.findMany({
//             where,
//             skip,
//             take,
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 chargers: true,
//                 shippers: true,
//                 thirdParties: true,
//                 ships: { include: { ship: true } },
//                 products: { include: { product: true } },
//                 incidents: true,
//                 attachments: true
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

export const getAllReportingSupervisorysService = async (params = {}) => {
    try {
        const { page = 1, limit = LIMIT, search, filter, value, restrictToUser, ...rest } = params;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        let where = { isActive: true };

        // ✅ Restriction automatique si OP ou head guard :
        // on ne retourne que les rapports créés par l'employé connecté.
        if (restrictToUser) {
            where.createdBy = restrictToUser;
        }

        // ── Recherche textuelle libre ──────────────────────────────────────────
        if (search) {
            where = {
                ...where,
                OR: [
                    { numRef:                 { contains: search } },
                    { productionNote:         { contains: search } },
                    { teamManagementFeedback: { contains: search } },
                    { titleWorkProgress:      { contains: search } },
                    { commentWorkProgress:    { contains: search } },
                    { incidentNote:           { contains: search } },
                    { createdBy:              { contains: search } },
                    { updatedBy:              { contains: search } },
                ],
            };
        }

        // ── Filtres structurés via filter + value ──────────────────────────────
        if (filter && value !== undefined && value !== '') {
            switch (filter) {
                case 'shiftId':
                    where.shiftId = value;
                    break;

                case 'incomingSupervisoryId':
                    where.incomingSupervisoryId = value;
                    break;

                case 'createdBy':
                    // ✅ Si restrictToUser actif, on ne laisse pas écraser la restriction
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
                    const [start, end] = value.split(',');
                    if (start && end) {
                        where[filter] = {
                            gte: new Date(start),
                            lte: new Date(new Date(end).setHours(23, 59, 59, 999)),
                        };
                    } else if (start) {
                        where[filter] = { gte: new Date(start) };
                    }
                    break;
                }

                default:
                    break;
            }
        }

        // ── Compatibilité ancienne API (params directs) ────────────────────────
        if (rest.shiftId)                where.shiftId                = rest.shiftId;
        if (rest.incomingSupervisoryId)  where.incomingSupervisoryId  = rest.incomingSupervisoryId;

        const total = await reportingSupervisoryClient.count({ where });
        const data  = await reportingSupervisoryClient.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                chargers:     true,
                shippers:     true,
                thirdParties: true,
                ships:        { include: { ship: true } },
                products:     { include: { product: true } },
                incidents:    true,
                attachments:  true,
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
export const getReportingSupervisorysByParamsService = async (params) => {
    return getAllReportingSupervisorysService(params);
};

/**
 * Récupération d'un rapport par son ID
 */
export const getReportingSupervisoryByIdService = async (id) => {
    try {
        const reportingSupervisory = await reportingSupervisoryClient.findUnique({
            where: { id, isActive: true },
            include: {
                chargers: true,
                shippers: true,
                thirdParties: true,
                ships: { include: { ship: true } },
                products: { include: { product: true } },
                incidents: true,
                attachments: true
            }
        });
        if (!reportingSupervisory) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);
        return apiResponse(false, undefined, reportingSupervisory);
    } catch (error) {
        console.error(error);
        return apiResponse(true, [{ msg: error.message, field: "server" }]);
    }
};

/**
 * Suppression logique d'un rapport
 */
export const deleteReportingSupervisoryService = async (id) => {
    try {
        const existing = await reportingSupervisoryClient.findUnique({
            where: { id, isActive: true }
        });
        if (!existing) return apiResponse(true, [{ msg: "Ce rapport n'existe pas", field: "id" }]);

        await reportingSupervisoryClient.update({
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
 * Récupération des reportingSupervisorys pour export Excel
 */
export const generateExcelReportingSupervisoryService = async (query) => {
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
                case 'shiftId':
                    where.shiftId = value;
                    break;

                case 'incomingSupervisoryId':
                    where.incomingSupervisoryId = value;
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

        // Filtre date via start/end directs (quand filter = createdAt ou updatedAt)
        if (start && end && (filter === 'createdAt' || filter === 'updatedAt')) {
            const field = filter;
            where[field] = condition === 'NOT'
                ? { not: { gte: new Date(start), lte: new Date(end) } }
                : { gte: new Date(start), lte: new Date(end) };
        }

        const data = await reportingSupervisoryClient.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                chargers: true,
                shippers: true,
                thirdParties: true,
                ships: { include: { ship: true } },
                products: { include: { product: true } },
                incidents: true,
                attachments: true
            },
        });

        return data;

    } catch (error) {
        console.error(error);
        throw new Error(`${error}`);
    }
};
