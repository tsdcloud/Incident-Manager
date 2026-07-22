import { EMAIL_HOST, ENTITY_API, NODE_ENV } from "../config.js";

import {
    createReportingSupervisoryService,
    deleteReportingSupervisoryService,
    getAllReportingSupervisorysService,
    getReportingSupervisorysByParamsService,
    getReportingSupervisoryByIdService,
    updateReportingSupervisoryService,
    generateExcelReportingSupervisoryService
} from "../services/reportingSupervisory.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import { fetchData } from "../utils/fetch.utils.js";
import HTTP_STATUS from "../utils/http.utils.js";
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { ADDRESS } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createReportingSupervisoryController = async (req, res) => {
    try {
        const result = await createReportingSupervisoryService(req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode;
        res.status(status).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
    }
};

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const getReportingSupervisoryByIdController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(apiResponse(true, [{ msg: "ID manquant", field: "id" }]));
    }
    try {
        const result = await getReportingSupervisoryByIdService(id);
        const status = result.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode;
        res.status(status).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
    }
};

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const getAllReportingSupervisorysController = async (req, res) => {
    try {
        const RESTRICTED_ROLES = ['OP', 'head guard', 'coordinator', 'CORDO'];

        let params = { ...req.query };

        // ✅ Récupérer l'ID et les rôles attachés par le middleware
        const currentUserId    = req.employeeId;
        const currentUserRoles = req.employeeRoles ?? [];

        // ✅ Restreint SI ET SEULEMENT SI tous les rôles sont dans RESTRICTED_ROLES
        const isRestricted =
            currentUserRoles.length > 0 &&
            currentUserRoles.every(r => RESTRICTED_ROLES.includes(r));

        if (isRestricted && currentUserId) {
            params.restrictToUser = currentUserId;
        }

        const result = await getAllReportingSupervisorysService(params);
        const status = result.error
            ? HTTP_STATUS.BAD_REQUEST.statusCode
            : HTTP_STATUS.OK.statusCode;

        res.status(status).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const updateReportingSupervisoryController = async (req, res) => {
    try {
        const result = await updateReportingSupervisoryService(req.params.id, req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        res.status(status).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
    }
};

/**
 * 
 * @param req 
 * @param res 
 */
export const deleteReportingSupervisoryController = async (req, res) => {
    try {
        const result = await deleteReportingSupervisoryService(req.params.id);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        res.status(status).json(result);
    } catch (error) {
        console.error(error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const generateExcelReportingSupervisoryController = async (req, res) => {
    try {
        // ==================== 1) Auth & Token ====================
        let { authorization } = req.headers;
        let token = authorization?.split(" ")[1];

        // ==================== 2) Dossier d'exports ====================
        const exportsDir = path.join(__dirname, '../../', 'exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
        }

        // ==================== 3) Récupération des données ====================
        const reportingSupervisorys = await generateExcelReportingSupervisoryService(req.query);

        if (!reportingSupervisorys || reportingSupervisorys.length === 0) {
            return res.status(404).json({
                message: 'Aucun reporting Superviseur trouvé pour les critères sélectionnés.'
            });
        }

        // ==================== 4) Création du classeur Excel ====================
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport Superviseur');

        worksheet.columns = [
            { header: 'Num. Référence', key: 'numRef', width: 18 },
            { header: 'Quart', key: 'shift', width: 15 },
            { header: 'Superviseur Entrant', key: 'incomingSupervisoryId', width: 20 },
            { header: 'Chargeurs', key: 'chargers', width: 30 },
            { header: 'Acconiers', key: 'shippers', width: 30 },
            { header: 'Tiers', key: 'thirdParties', width: 30 },
            { header: 'Navires', key: 'ships', width: 30 },
            { header: 'Produits', key: 'products', width: 30 },
            { header: 'Pesées complètes (à facturer)', key: 'completeNumberWeighingsToBeBilled', width: 28 },
            { header: 'Pesées complètes (par espèce)', key: 'completeNumberWeighingsBySpecies', width: 28 },
            { header: 'Pesées incomplètes (à facturer)', key: 'incompleteNumberWeighingsToBeBilled', width: 28 },
            { header: 'Pesées incomplètes (par espèce)', key: 'incompleteNumberWeighingsBySpecies', width: 28 },
            { header: 'Pesées test (à facturer)', key: 'testNumberWeighingsToBeBilled', width: 25 },
            { header: 'Pesées test (par espèce)', key: 'testNumberWeighingsBySpecies', width: 25 },
            { header: 'Passages sans pesée (à facturer)', key: 'numberPassagesWithoutWeighingToBeBilled', width: 30 },
            { header: 'Passages sans pesée (par espèce)', key: 'numberPassagesWithoutWeighingBySpecies', width: 30 },
            { header: 'Tonnage brut', key: 'grossTonnage', width: 15 },
            { header: 'Note production', key: 'productionNote', width: 40 },
            { header: 'Ressources attendues', key: 'expectedNumberResources', width: 22 },
            { header: 'Ressources disponibles', key: 'availableNumberResources', width: 22 },
            { header: 'Ressources en retard', key: 'overdueNumberResources', width: 22 },
            { header: 'Ressources manquantes', key: 'missingNumberResources', width: 22 },
            { header: 'Feedback gestion équipe', key: 'teamManagementFeedback', width: 40 },
            { header: 'Titre avancement travaux', key: 'titleWorkProgress', width: 25 },
            { header: 'Commentaire avancement travaux', key: 'commentWorkProgress', width: 40 },
            { header: 'Nombre d\'incidents', key: 'numberIncidents', width: 20 },
            { header: 'Détail incidents', key: 'incidentsDetail', width: 60 },
            { header: 'Note incidents', key: 'incidentNote', width: 40 },
            { header: 'Créé par', key: 'createdBy', width: 20 },
            { header: 'Modifié par', key: 'updatedBy', width: 20 },
            { header: 'Date de création', key: 'createdAt', width: 20 },
            { header: 'Date de modification', key: 'updatedAt', width: 20 },
            { header: 'Actif', key: 'isActive', width: 10 },
        ];

        // ── Style header ──────────────────────────────────────────────────────
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' },
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // ==================== 5) Données externes ====================
        const [employees, shifts, suppliers, ships, products] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/shifts/`, token),
            fetchData(`${ENTITY_API}/suppliers/`, token),
            prisma.ship.findMany({ where: { isActive: true } }),
            prisma.product.findMany({ where: { isActive: true } }),
        ]);

        // ── Utilitaires ───────────────────────────────────────────────────────
        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
        };

        const findEmployeeName = (id) =>
            employees?.data?.find(item => item?.id === id)?.name || id || "--";

        const findSupplierName = (id) =>
            suppliers?.data?.find(item => item?.id === id)?.name || id || "--";

        const findShiftName = (id) =>
            shifts?.data?.find(item => item?.id === id)?.name || id || "--";

        const findShipName = (id) =>
            ships?.find(item => item?.id === id)?.name || id || "--";

        const findProductName = (id) =>
            products?.find(item => item?.id === id)?.name || id || "--";

        // ==================== 6) Ajout des lignes ====================
        reportingSupervisorys.forEach((rs) => {
            const shiftName = findShiftName(rs.shiftId);
            const incomingSupervisoryName = findEmployeeName(rs.incomingSupervisoryId);
            const createdByName = findEmployeeName(rs.createdBy);
            const updatedByName = findEmployeeName(rs.updatedBy);

            // Chargeurs, Acconiers, Tiers : liste de noms séparés par virgule
            const chargerNames = rs.chargers?.length
                ? rs.chargers.map(c => findSupplierName(c.chargerId)).join(', ')
                : "--";

            const shipperNames = rs.shippers?.length
                ? rs.shippers.map(s => findSupplierName(s.shipperId)).join(', ')
                : "--";

            const thirdPartyNames = rs.thirdParties?.length
                ? rs.thirdParties.map(t => findSupplierName(t.thirdPartyId)).join(', ')
                : "--";

            // Navires et Produits
            const shipNames = rs.ships?.length
                ? rs.ships.map(s => findShipName(s.shipId)).join(', ')
                : "--";

            const productNames = rs.products?.length
                ? rs.products.map(p => findProductName(p.productId)).join(', ')
                : "--";

            // Détail des incidents
            const incidentsDetail = rs.incidents?.length
                ? rs.incidents.map((inc, idx) =>
                    `[${idx + 1}] Équipement: ${inc.equipment}, Panne: ${inc.breakdown}, Type: ${inc.typeFailure}, Arrêt: ${inc.downtime}, Statut: ${inc.status}, Gestionnaire: ${inc.managerFailure}`
                ).join(' | ')
                : "--";

            worksheet.addRow({
                numRef: rs.numRef || "--",
                shift: shiftName,
                incomingSupervisoryId: incomingSupervisoryName,
                chargers: chargerNames,
                shippers: shipperNames,
                thirdParties: thirdPartyNames,
                ships: shipNames,
                products: productNames,
                completeNumberWeighingsToBeBilled: rs.completeNumberWeighingsToBeBilled ?? 0,
                completeNumberWeighingsBySpecies: rs.completeNumberWeighingsBySpecies ?? 0,
                incompleteNumberWeighingsToBeBilled: rs.incompleteNumberWeighingsToBeBilled ?? 0,
                incompleteNumberWeighingsBySpecies: rs.incompleteNumberWeighingsBySpecies ?? 0,
                testNumberWeighingsToBeBilled: rs.testNumberWeighingsToBeBilled ?? 0,
                testNumberWeighingsBySpecies: rs.testNumberWeighingsBySpecies ?? 0,
                numberPassagesWithoutWeighingToBeBilled: rs.numberPassagesWithoutWeighingToBeBilled ?? 0,
                numberPassagesWithoutWeighingBySpecies: rs.numberPassagesWithoutWeighingBySpecies ?? 0,
                grossTonnage: rs.grossTonnage ?? 0,
                productionNote: rs.productionNote || "--",
                expectedNumberResources: rs.expectedNumberResources ?? 0,
                availableNumberResources: rs.availableNumberResources ?? 0,
                overdueNumberResources: rs.overdueNumberResources ?? 0,
                missingNumberResources: rs.missingNumberResources ?? 0,
                teamManagementFeedback: rs.teamManagementFeedback || "--",
                titleWorkProgress: rs.titleWorkProgress || "--",
                commentWorkProgress: rs.commentWorkProgress || "--",
                numberIncidents: rs.numberIncidents ?? 0,
                incidentsDetail: incidentsDetail,
                incidentNote: rs.incidentNote || "--",
                createdBy: createdByName,
                updatedBy: updatedByName,
                createdAt: formatDate(rs.createdAt),
                updatedAt: formatDate(rs.updatedAt),
                isActive: rs.isActive ? "Oui" : "Non",
            });
        });

        // ── Style lignes de données ───────────────────────────────────────────
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                });
            }
        });

        // ==================== 7) Sauvegarde & réponse ====================
        const filePath = path.join(exportsDir, `reporting_supervisory_report.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        const downloadLink = `${ADDRESS}/api/exports/reporting_supervisory_report.xlsx`;

        res.status(HTTP_STATUS.OK.statusCode).json({
            message: 'File created successfully',
            downloadLink,
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
    }
};
