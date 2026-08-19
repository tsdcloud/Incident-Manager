
// import { EMAIL_HOST, ENTITY_API, NODE_ENV } from "../config.js";

// import {
//     createReportingCgService,
//     deleteReportingCgService,
//     getAllReportingCgsService,
//     getReportingCgsByParamsService,
//     getReportingCgByIdService,
//     updateReportingCgService,
//     generateExcelReportingCgService
// } from "../services/reportingCg.service.js";
// import { apiResponse } from "../utils/apiResponse.js";
// import { fetchData } from "../utils/fetch.utils.js";
// import HTTP_STATUS from "../utils/http.utils.js";
// import path from 'path';
// import fs from 'fs'
// import { fileURLToPath } from 'url';
// import ExcelJS from 'exceljs';
// import { ADDRESS } from "../config.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// /**
//  * 
//  * @param req 
//  * @param res 
//  * @returns 
//  */
// export const createReportingCgController = async (req, res) => {
//     try {
//         const result = await createReportingCgService(req.body);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode;
//         res.status(status).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
//     }
// };

// /**
//  * 
//  * @param req
//  * @param res 
//  * @returns 
//  */
// export const getReportingCgByIdController = async (req, res) => {
//     const { id } = req.params;
//     if (!id) {
//         return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(apiResponse(true, [{ msg: "ID manquant", field: "id" }]));
//     }
//     try {
//         const result = await getReportingCgByIdService(id);
//         const status = result.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode;
//         res.status(status).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
//     }
// };

// /**
//  * 
//  * @param req
//  * @param res 
//  * @returns 
//  */
// export const getAllReportingCgsController = async (req, res) => {
//     try {
//         const RESTRICTED_ROLES = ['OP', 'head guard'];

//         let params = { ...req.query };

//         // ✅ Récupérer l'ID et les rôles attachés par le middleware
//         const currentUserId   = req.employeeId;
//         const currentUserRoles = req.employeeRoles ?? [];

//         // ✅ Restreint SI ET SEULEMENT SI tous les rôles sont dans RESTRICTED_ROLES
//         const isRestricted =
//             currentUserRoles.length > 0 &&
//             currentUserRoles.every(r => RESTRICTED_ROLES.includes(r));

//         if (isRestricted && currentUserId) {
//             params.restrictToUser = currentUserId;
//         }

//         const result = await getAllReportingCgsService(params);
//         const status = result.error
//             ? HTTP_STATUS.BAD_REQUEST.statusCode
//             : HTTP_STATUS.OK.statusCode;

//         res.status(status).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// /**
//  * 
//  * @param req
//  * @param res 
//  * @returns 
//  */
// export const updateReportingCgController = async (req, res) => {
//     try {
//         const result = await updateReportingCgService(req.params.id, req.body);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
//         res.status(status).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
//     }
// };

// /**
//  * 
//  * @param req 
//  * @param res 
//  */
// export const deleteReportingCgController = async (req, res) => {
//     try {
//         const result = await deleteReportingCgService(req.params.id);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
//         res.status(status).json(result);
//     } catch (error) {
//         console.error(error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(apiResponse(true, [{ msg: error.message, field: "server" }]));
//     }
// };

// /**
//  * 
//  * @param {*} req 
//  * @param {*} res 
//  */
// export const generateExcelReportingCgController = async (req, res) => {
//     try {
//         // ==================== 1) Auth & Token ====================
//         let { authorization } = req.headers;
//         let token = authorization?.split(" ")[1];

//         // ==================== 2) Dossier d'exports ====================
//         const exportsDir = path.join(__dirname, '../../', 'exports');
//         if (!fs.existsSync(exportsDir)) {
//             fs.mkdirSync(exportsDir);
//         }

//         // ==================== 3) Récupération des données ====================
//         const reportingCgs = await generateExcelReportingCgService(req.query);

//         if (!reportingCgs || reportingCgs.length === 0) {
//             return res.status(404).json({
//                 message: 'Aucun reporting CG trouvé pour les critères sélectionnés.'
//             });
//         }

//         // ==================== 4) Création du classeur Excel ====================
//         const workbook  = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Rapport CG');

//         worksheet.columns = [
//             { header: 'Num. Référence',                       key: 'numRef',                                    width: 18 },
//             { header: 'Site',                                 key: 'site',                                      width: 20 },
//             { header: 'Quart',                                key: 'shift',                                     width: 15 },
//             { header: 'N° Fiche recette',                     key: 'recipeCardNumber',                                     width: 15 },
//             { header: 'CG Entrant',                           key: 'incomingCgId',                              width: 20 },
//             { header: 'Opérateurs',                           key: 'operators',                                 width: 30 },
//             { header: 'HSE',                                  key: 'hses',                                      width: 30 },
//             { header: 'Pesées complètes (à facturer)',        key: 'completeNumberWeighingsToBeBilled',          width: 28 },
//             { header: 'Pesées complètes (par espèce)',        key: 'completeNumberWeighingsBySpecies',           width: 28 },
//             { header: 'Pesées incomplètes (à facturer)',      key: 'incompleteNumberWeighingsToBeBilled',        width: 28 },
//             { header: 'Pesées incomplètes (par espèce)',      key: 'incompleteNumberWeighingsBySpecies',         width: 28 },
//             { header: 'Pesées test (à facturer)',             key: 'testNumberWeighingsToBeBilled',              width: 25 },
//             { header: 'Pesées test (par espèce)',             key: 'testNumberWeighingsBySpecies',               width: 25 },
//             { header: 'Passages sans pesée (à facturer)',     key: 'numberPassagesWithoutWeighingToBeBilled',    width: 30 },
//             { header: 'Passages sans pesée (par espèce)',     key: 'numberPassagesWithoutWeighingBySpecies',     width: 30 },
//             { header: 'Nombre d\'incidents',                  key: 'numberIncidents',                           width: 20 },
//             { header: 'Description incidents',                key: 'incidentDescription',                       width: 40 },
//             { header: 'Description production',               key: 'productionDescription',                     width: 40 },
//             { header: 'Fichier extraction',                   key: 'extractionFileUrl',                         width: 30 },
//             { header: 'Hors-pont (nombre)',                   key: 'offBridgeNumber',                             width: 20 },
//             { header: 'Montant total pesée',                  key: 'totalWeightAmount',                           width: 22 },
//             // { header: 'Montant total pesée à facturer',       key: 'totalWeightAmountToBeBilled',                 width: 28 },
//             { header: 'Montant total pesée test',             key: 'totalTestWeightAmount',                       width: 25 },
//             { header: 'Montant total hors-pont',              key: 'totalOffBridgeAmount',                        width: 25 },
//             { header: 'Consommables en rupture',              key: 'consumables',                                 width: 35 },
//             { header: 'Premier n° pesée',                   key: 'firstWeighNumber',                            width: 20 },
//             { header: 'Dernier n° pesée',                   key: 'lastWeighNumber',                             width: 20 },
//             { header: 'Premier n° tracteur',                key: 'firstWeighTractorNumber',                     width: 20 },
//             { header: 'Dernier n° tracteur',                key: 'lastWeighTractorNumber',                      width: 20 },
//             { header: 'Date première pesée',                key: 'firstWeighDate',                              width: 22 },
//             { header: 'Date dernière pesée',                key: 'lastWeighDate',                               width: 22 },
//             { header: 'Créé par',                             key: 'createdBy',                                 width: 20 },
//             { header: 'Modifié par',                          key: 'updatedBy',                                 width: 20 },
//             { header: 'Date de création',                     key: 'createdAt',                                 width: 20 },
//             { header: 'Date de modification',                 key: 'updatedAt',                                 width: 20 },
//             { header: 'Actif',                                key: 'isActive',                                  width: 10 },
//         ];

//         // ── Style header ──────────────────────────────────────────────────────
//         const headerRow = worksheet.getRow(1);
//         headerRow.eachCell((cell) => {
//             cell.font = { bold: true };
//             cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'FFD3D3D3' },
//             };
//             cell.border = {
//                 top:    { style: 'thin' },
//                 left:   { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right:  { style: 'thin' },
//             };
//             cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         });

//         // ==================== 5) Données externes (employés, sites, quarts) ====================
//         const [employees, sites, shifts] = await Promise.all([
//             fetchData(`${ENTITY_API}/employees/`, token),
//             fetchData(`${ENTITY_API}/sites/`,     token),
//             fetchData(`${ENTITY_API}/shifts/`,    token),
//         ]);

//         // ── Utilitaires ───────────────────────────────────────────────────────
//         const formatDate = (dateString) => {
//             if (!dateString) return "";
//             const date = new Date(dateString);
//             return isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
//         };

//         const findName = (list, id) =>
//             list?.data?.find(item => item?.id === id)?.name || id || "--";

//         // ==================== 6) Ajout des lignes ====================
//         reportingCgs.forEach((rcg) => {
//             const siteName  = findName(sites,  rcg.siteId);
//             const shiftName = findName(shifts, rcg.shiftId);
//             const createdByName = findName(employees, rcg.createdBy);
//             const updatedByName = findName(employees, rcg.updatedBy);
//             const incomingCgIdName = findName(employees, rcg.incomingCgId);

//             // Opérateurs et HSE : liste de noms séparés par virgule
//             const operatorNames = rcg.operators?.length
//                 ? rcg.operators.map(op => findName(employees, op.operatorId)).join(', ')
//                 : "--";

//             const hseNames = rcg.hses?.length
//                 ? rcg.hses.map(h => findName(employees, h.hseId)).join(', ')
//                 : "--";

//             // Consommables en rupture
//             const consumableNames = rcg.outOfStockConsumableReportingCgs?.length
//                 ? rcg.outOfStockConsumableReportingCgs
//                     .map(c => c.consumable?.name || c.consumableId)
//                     .filter(Boolean)
//                     .join(', ')
//                 : "--";

//             worksheet.addRow({
//                 numRef:                                 rcg.numRef                                || "--",
//                 site:                                   siteName,
//                 shift:                                  shiftName,
//                 recipeCardNumber:                       rcg.recipeCardNumber                      || "--",
//                 incomingCgId:                           incomingCgIdName                          || "--",
//                 operators:                              operatorNames,
//                 hses:                                   hseNames,
//                 completeNumberWeighingsToBeBilled:      rcg.completeNumberWeighingsToBeBilled     ?? 0,
//                 completeNumberWeighingsBySpecies:       rcg.completeNumberWeighingsBySpecies      ?? 0,
//                 incompleteNumberWeighingsToBeBilled:    rcg.incompleteNumberWeighingsToBeBilled   ?? 0,
//                 incompleteNumberWeighingsBySpecies:     rcg.incompleteNumberWeighingsBySpecies    ?? 0,
//                 testNumberWeighingsToBeBilled:          rcg.testNumberWeighingsToBeBilled         ?? 0,
//                 testNumberWeighingsBySpecies:           rcg.testNumberWeighingsBySpecies          ?? 0,
//                 numberPassagesWithoutWeighingToBeBilled:rcg.numberPassagesWithoutWeighingToBeBilled ?? 0,
//                 numberPassagesWithoutWeighingBySpecies: rcg.numberPassagesWithoutWeighingBySpecies  ?? 0,
//                 numberIncidents:                        rcg.numberIncidents                      ?? 0,
//                 incidentDescription:                    rcg.incidentDescription                  || "--",
//                 productionDescription:                  rcg.productionDescription                || "--",
//                 extractionFileUrl:                      rcg.extractionFileUrl                    || "--",
//                 offBridgeNumber:                        rcg.offBridgeNumber                      ?? 0,
//                 totalWeightAmount:                      rcg.totalWeightAmount                    ?? 0,
//                 // totalWeightAmountToBeBilled:            rcg.totalWeightAmountToBeBilled          ?? 0,
//                 totalTestWeightAmount:                  rcg.totalTestWeightAmount                ?? 0,
//                 totalOffBridgeAmount:                   rcg.totalOffBridgeAmount                 ?? 0,
//                 consumables:                            consumableNames,
//                 firstWeighNumber:                       rcg.firstWeighNumber                     || "--",
//                 lastWeighNumber:                        rcg.lastWeighNumber                      || "--",
//                 firstWeighTractorNumber:                rcg.firstWeighTractorNumber              || "--",
//                 lastWeighTractorNumber:                 rcg.lastWeighTractorNumber               || "--",
//                 firstWeighDate:                         formatDate(rcg.firstWeighDate),
//                 lastWeighDate:                          formatDate(rcg.lastWeighDate),
//                 createdBy:                              createdByName,
//                 updatedBy:                              updatedByName,
//                 createdAt:                              formatDate(rcg.createdAt),
//                 updatedAt:                              formatDate(rcg.updatedAt),
//                 isActive:                               rcg.isActive ? "Oui" : "Non",
//             });
//         });

//         // ── Style lignes de données ───────────────────────────────────────────
//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber > 1) {
//                 row.eachCell((cell) => {
//                     cell.border = {
//                         top:    { style: 'thin' },
//                         left:   { style: 'thin' },
//                         bottom: { style: 'thin' },
//                         right:  { style: 'thin' },
//                     };
//                 });
//             }
//         });

//         // ==================== 7) Sauvegarde & réponse ====================
//         const filePath     = path.join(exportsDir, `reporting_cg_report.xlsx`);
//         await workbook.xlsx.writeFile(filePath);
//         const downloadLink = `${ADDRESS}/api/exports/reporting_cg_report.xlsx`;

//         res.status(HTTP_STATUS.OK.statusCode).json({
//             message: 'File created successfully',
//             downloadLink,
//         });

//     } catch (error) {
//         console.error(error);
//         res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
//     }
// };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';

import { ADDRESS, ENTITY_API } from "../config.js";
import {
    createReportingCgService,
    deleteReportingCgService,
    generateExcelReportingCgService,
    getAllReportingCgsService,
    getReportingCgByIdService,
    updateReportingCgService,
} from "../services/reportingCg.service.js";

import { apiResponse } from "../utils/apiResponse.js";
import { fetchData } from "../utils/fetch.utils.js";
import HTTP_STATUS from "../utils/http.utils.js";

// ============================================================
// PATH & DIRECTORY CONFIG
// ============================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIGURATION PDF (pdfmake 0.2.x)
// ============================================================
const standardFonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};

const printer = new PdfPrinter(standardFonts);

// ============================================================
// LOGO PDF
// ============================================================
const headerImagePath = path.join(__dirname, '../../assets/logo_dpws.png');
let headerImageBase64 = null;

try {
    if (fs.existsSync(headerImagePath)) {
        headerImageBase64 = fs.readFileSync(headerImagePath).toString('base64');
        console.log('Logo PDF chargé avec succès.');
    } else {
        console.warn(`Logo PDF introuvable : ${headerImagePath}`);
    }
} catch (error) {
    console.warn("Impossible de charger l'image d'en-tête PDF :", error.message);
}

// ============================================================
// HELPERS
// ============================================================
const formatDate = (date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleString('fr-FR');
};

const formatDateShort = (date) => {
    if (!date) return '-';
    const parsedDate = new Date(date);
    return Number.isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleDateString('fr-FR');
};


const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
        return '-';
    }

    return numericValue
        .toLocaleString('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })
        .replace(/[\u00A0\u202F]/g, ' ');
};

const findEntityName = (response, id) => {
    if (!id) return '-';
    const list = response?.data;
    if (!Array.isArray(list)) return id;
    const entity = list.find(item => item?.id === id);
    return entity?.name || id;
};

const getPdfReferences = async (token) => {
    try {
        const [employees, sites, shifts] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/sites/`, token),
            fetchData(`${ENTITY_API}/shifts/`, token)
        ]);

        return { employees, sites, shifts };
    } catch (error) {
        console.error("Erreur lors du chargement des références PDF :", error);
        return {
            employees: { data: [] },
            sites: { data: [] },
            shifts: { data: [] }
        };
    }
};

const getEmployeeName = (employees, id) => findEntityName(employees, id);
const getSiteName = (sites, id) => findEntityName(sites, id);
const getShiftName = (shifts, id) => findEntityName(shifts, id);

// ============================================================
// CONTROLLERS CRUD
// ============================================================

export const createReportingCgController = async (req, res) => {
    try {
        const result = await createReportingCgService(req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur création reporting CG :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const getReportingCgByIdController = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(
            apiResponse(true, [{ msg: "ID manquant", field: "id" }])
        );
    }

    try {
        const result = await getReportingCgByIdService(id);
        const status = result.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur récupération reporting CG :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const getAllReportingCgsController = async (req, res) => {
    try {
        const RESTRICTED_ROLES = ['OP', 'head guard'];
        const params = { ...req.query };
        const currentUserId = req.employeeId;
        const currentUserRoles = req.employeeRoles ?? [];

        const isRestricted = currentUserRoles.length > 0 && 
            currentUserRoles.every(role => RESTRICTED_ROLES.includes(role));

        if (isRestricted && currentUserId) {
            params.restrictToUser = currentUserId;
        }

        const result = await getAllReportingCgsService(params);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur récupération reportings CG :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const updateReportingCgController = async (req, res) => {
    try {
        const result = await updateReportingCgService(req.params.id, req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur modification reporting CG :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const deleteReportingCgController = async (req, res) => {
    try {
        const result = await deleteReportingCgService(req.params.id);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur suppression reporting CG :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

// ============================================================
// EXPORT EXCEL
// ============================================================

export const generateExcelReportingCgController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const exportsDir = path.join(__dirname, '../../exports');

        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        const reportingCgs = await generateExcelReportingCgService(req.query);

        if (!reportingCgs || reportingCgs.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json({
                message: 'Aucun reporting CG trouvé pour les critères sélectionnés.'
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport CG');

        worksheet.columns = [
            { header: 'Num. Référence', key: 'numRef', width: 18 },
            { header: 'Site', key: 'site', width: 20 },
            { header: 'Quart', key: 'shift', width: 15 },
            { header: 'N° Fiche recette', key: 'recipeCardNumber', width: 15 },
            { header: 'CG Entrant', key: 'incomingCgId', width: 20 },
            { header: 'Opérateurs', key: 'operators', width: 30 },
            { header: 'HSE', key: 'hses', width: 30 },
            { header: 'Pesées complètes (à facturer)', key: 'completeNumberWeighingsToBeBilled', width: 28 },
            { header: 'Pesées complètes (par espèce)', key: 'completeNumberWeighingsBySpecies', width: 28 },
            { header: 'Pesées incomplètes (à facturer)', key: 'incompleteNumberWeighingsToBeBilled', width: 30 },
            { header: 'Pesées incomplètes (par espèce)', key: 'incompleteNumberWeighingsBySpecies', width: 30 },
            { header: 'Pesées test (à facturer)', key: 'testNumberWeighingsToBeBilled', width: 25 },
            { header: 'Pesées test (par espèce)', key: 'testNumberWeighingsBySpecies', width: 25 },
            { header: 'Passages sans pesée (à facturer)', key: 'numberPassagesWithoutWeighingToBeBilled', width: 30 },
            { header: 'Passages sans pesée (par espèce)', key: 'numberPassagesWithoutWeighingBySpecies', width: 30 },
            { header: 'Nombre d\'incidents', key: 'numberIncidents', width: 20 },
            { header: 'Description incidents', key: 'incidentDescription', width: 40 },
            { header: 'Description production', key: 'productionDescription', width: 40 },
            { header: 'Fichier extraction', key: 'extractionFileUrl', width: 30 },
            { header: 'Hors-pont (nombre)', key: 'offBridgeNumber', width: 20 },
            { header: 'Montant total pesée', key: 'totalWeightAmount', width: 22 },
            { header: 'Montant total pesée test', key: 'totalTestWeightAmount', width: 25 },
            { header: 'Montant total hors-pont', key: 'totalOffBridgeAmount', width: 25 },
            { header: 'Consommables en rupture', key: 'consumables', width: 35 },
            { header: 'Premier n° pesée', key: 'firstWeighNumber', width: 20 },
            { header: 'Dernier n° pesée', key: 'lastWeighNumber', width: 20 },
            { header: 'Premier n° tracteur', key: 'firstWeighTractorNumber', width: 20 },
            { header: 'Dernier n° tracteur', key: 'lastWeighTractorNumber', width: 20 },
            { header: 'Date première pesée', key: 'firstWeighDate', width: 22 },
            { header: 'Date dernière pesée', key: 'lastWeighDate', width: 22 },
            { header: 'Créé par', key: 'createdBy', width: 20 },
            { header: 'Modifié par', key: 'updatedBy', width: 20 },
            { header: 'Date de création', key: 'createdAt', width: 20 },
            { header: 'Date de modification', key: 'updatedAt', width: 20 },
            { header: 'Actif', key: 'isActive', width: 10 }
        ];

        // En-tête Excel
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        const [employees, sites, shifts] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/sites/`, token),
            fetchData(`${ENTITY_API}/shifts/`, token)
        ]);

        reportingCgs.forEach(rcg => {
            const operatorNames = rcg.operators?.length
                ? rcg.operators.map(op => findEntityName(employees, op.operatorId)).join(', ')
                : "--";

            const hseNames = rcg.hses?.length
                ? rcg.hses.map(h => findEntityName(employees, h.hseId)).join(', ')
                : "--";

            const consumableNames = rcg.outOfStockConsumableReportingCgs?.length
                ? rcg.outOfStockConsumableReportingCgs.map(c => c.consumable?.name || c.consumableId).filter(Boolean).join(', ')
                : "--";

            worksheet.addRow({
                numRef: rcg.numRef || "--",
                site: findEntityName(sites, rcg.siteId),
                shift: findEntityName(shifts, rcg.shiftId),
                recipeCardNumber: rcg.recipeCardNumber || "--",
                incomingCgId: findEntityName(employees, rcg.incomingCgId),
                operators: operatorNames,
                hses: hseNames,
                completeNumberWeighingsToBeBilled: rcg.completeNumberWeighingsToBeBilled ?? 0,
                completeNumberWeighingsBySpecies: rcg.completeNumberWeighingsBySpecies ?? 0,
                incompleteNumberWeighingsToBeBilled: rcg.incompleteNumberWeighingsToBeBilled ?? 0,
                incompleteNumberWeighingsBySpecies: rcg.incompleteNumberWeighingsBySpecies ?? 0,
                testNumberWeighingsToBeBilled: rcg.testNumberWeighingsToBeBilled ?? 0,
                testNumberWeighingsBySpecies: rcg.testNumberWeighingsBySpecies ?? 0,
                numberPassagesWithoutWeighingToBeBilled: rcg.numberPassagesWithoutWeighingToBeBilled ?? 0,
                numberPassagesWithoutWeighingBySpecies: rcg.numberPassagesWithoutWeighingBySpecies ?? 0,
                numberIncidents: rcg.numberIncidents ?? 0,
                incidentDescription: rcg.incidentDescription || "--",
                productionDescription: rcg.productionDescription || "--",
                extractionFileUrl: rcg.extractionFileUrl || "--",
                offBridgeNumber: rcg.offBridgeNumber ?? 0,
                totalWeightAmount: rcg.totalWeightAmount ?? 0,
                totalTestWeightAmount: rcg.totalTestWeightAmount ?? 0,
                totalOffBridgeAmount: rcg.totalOffBridgeAmount ?? 0,
                consumables: consumableNames,
                firstWeighNumber: rcg.firstWeighNumber || "--",
                lastWeighNumber: rcg.lastWeighNumber || "--",
                firstWeighTractorNumber: rcg.firstWeighTractorNumber || "--",
                lastWeighTractorNumber: rcg.lastWeighTractorNumber || "--",
                firstWeighDate: formatDateShort(rcg.firstWeighDate),
                lastWeighDate: formatDateShort(rcg.lastWeighDate),
                createdBy: findEntityName(employees, rcg.createdBy),
                updatedBy: findEntityName(employees, rcg.updatedBy),
                createdAt: formatDate(rcg.createdAt),
                updatedAt: formatDate(rcg.updatedAt),
                isActive: rcg.isActive ? "Oui" : "Non"
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell(cell => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            }
        });

        const filePath = path.join(exportsDir, 'reporting_cg_report.xlsx');
        await workbook.xlsx.writeFile(filePath);

        return res.status(HTTP_STATUS.OK.statusCode).json({
            message: 'File created successfully',
            downloadLink: `${ADDRESS}/api/exports/reporting_cg_report.xlsx`
        });

    } catch (error) {
        console.error('Erreur génération Excel :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

// ============================================================
// EXPORT PDF REPORTING CG
// ============================================================
export const exportPdfReportingCgController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(HTTPSTATUS.BAD_REQUEST.statusCode).json({
                error: true,
                message: 'ID du reporting CG manquant.'
            });
        }

        const authorization = req.headers.authorization;
        const token = authorization?.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : null;

        if (!token) {
            return res.status(HTTPSTATUS.UNAUTHORIZED?.statusCode || 401).json({
                error: true,
                message: 'Token d’authentification manquant.'
            });
        }

        const result = await getReportingCgByIdService(id);

        if (!result || result.error || !result.data) {
            return res.status(HTTPSTATUS.NOT_FOUND.statusCode).json(
                result || {
                    error: true,
                    message: 'Reporting CG introuvable.'
                }
            );
        }

        const rcg = result.data;

        // Références venant de l'API Entity
        const { employees, sites, shifts } = await getPdfReferences(token);

        const siteName = getSiteName(sites, rcg.siteId);
        const shiftName = getShiftName(shifts, rcg.shiftId);
        const createdByName = getEmployeeName(employees, rcg.createdBy);
        const incomingCgName = getEmployeeName(employees, rcg.incomingCgId);

        const operatorsList = rcg.operators?.length
            ? rcg.operators
                .map((op) => getEmployeeName(employees, op.operatorId))
                .filter(Boolean)
            : [];

        const hseList = rcg.hses?.length
            ? rcg.hses
                .map((hse) => getEmployeeName(employees, hse.hseId))
                .filter(Boolean)
            : [];

        const consumablesList = rcg.outOfStockConsumableReportingCgs?.length
            ? rcg.outOfStockConsumableReportingCgs
                .map((item) => item.consumable?.name || item.consumableId)
                .filter(Boolean)
            : [];

        // ============================================================
        // Valeurs numériques sécurisées
        // ============================================================
        const completeToBill = Number(rcg.completeNumberWeighingsToBeBilled) || 0;
        const completeBySpecies = Number(rcg.completeNumberWeighingsBySpecies) || 0;

        const incompleteToBill = Number(rcg.incompleteNumberWeighingsToBeBilled) || 0;
        const incompleteBySpecies = Number(rcg.incompleteNumberWeighingsBySpecies) || 0;

        const testToBill = Number(rcg.testNumberWeighingsToBeBilled) || 0;
        const testBySpecies = Number(rcg.testNumberWeighingsBySpecies) || 0;

        const offBridgeNumber = Number(rcg.offBridgeNumber) || 0;

        const passagesWithoutWeighingToBill =
            Number(rcg.numberPassagesWithoutWeighingToBeBilled) || 0;

        const passagesWithoutWeighingBySpecies =
            Number(rcg.numberPassagesWithoutWeighingBySpecies) || 0;

        const totalToBill =
            completeToBill +
            incompleteToBill +
            testToBill +
            passagesWithoutWeighingToBill;

        const totalBySpecies =
            completeBySpecies +
            incompleteBySpecies +
            testBySpecies +
            passagesWithoutWeighingBySpecies +
            offBridgeNumber;

        const totalWeighings = totalToBill + totalBySpecies;

        const totalRevenue =
            (Number(rcg.totalWeightAmount) || 0) +
            (Number(rcg.totalTestWeightAmount) || 0) +
            (Number(rcg.totalOffBridgeAmount) || 0);

        // ============================================================
        // Helpers pdfmake
        // ============================================================
        const emptyOrDash = (value) => {
            if (value === null || value === undefined || value === '') {
                return '-';
            }

            return String(value);
        };

        const labelCell = (text) => ({
            text,
            bold: true,
            fillColor: '#F3F4F6',
            color: '#1F2937'
        });

        const tableHeader = (text) => ({
            text,
            bold: true,
            fillColor: '#E5E7EB',
            color: '#111827',
            alignment: 'center',
            margin: [0, 3, 0, 3]
        });

        // ============================================================
        // Document PDF
        // ============================================================
        const docDefinition = {
            defaultStyle: {
                font: 'Helvetica',
                fontSize: 8.5,
                color: '#1F2937'
            },

            pageSize: 'A4',
            // [gauche, haut, droite, bas]
            pageMargins: [28, 10, 28, 42],

            header: () => ({
                text: `Rapport CG${rcg.numRef ? ` - ${rcg.numRef}` : ''}`,
                alignment: 'right',
                fontSize: 7,
                color: '#9CA3AF',
                margin: [0, 10, 10, 0]
            }),

            footer: (currentPage, pageCount) => ({
                columns: [
                    {
                        text: `Rapport CG - ${rcg.numRef || '-'}`,
                        alignment: 'left'
                    },
                    {
                        text: `Page ${currentPage} / ${pageCount}`,
                        alignment: 'right'
                    }
                ],
                fontSize: 7,
                color: '#6B7280',
                margin: [28, 0, 28, 10]
            }),

            content: [
                headerImageBase64
                    ? {
                        image: `data:image/png;base64,${headerImageBase64}`,
                        width: 125,
                        alignment: 'center',
                        // Aucun espace au-dessus du logo
                        margin: [0, 0, 0, 5]
                    }
                    : {},

                {
                    text: 'REPORTING CG',
                    style: 'title'
                },

                {
                    columns: [
                        {
                            text: `Référence : ${rcg.numRef || '-'}`,
                            style: 'subtitle',
                            alignment: 'left'
                        },
                        {
                            text: `Date d’édition : ${formatDate(new Date())}`,
                            style: 'subtitle',
                            alignment: 'right'
                        }
                    ],
                    margin: [0, 3, 0, 10]
                },

                // ----------------------------------------------------
                // 1. Informations générales
                // ----------------------------------------------------
                {
                    text: '1. INFORMATIONS GÉNÉRALES',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['18%', '32%', '18%', '32%'],
                        body: [
                            [
                                labelCell('Référence'),
                                emptyOrDash(rcg.numRef),
                                labelCell('Site'),
                                emptyOrDash(siteName)
                            ],
                            [
                                labelCell('Quart'),
                                emptyOrDash(shiftName),
                                labelCell('Créé par'),
                                emptyOrDash(createdByName)
                            ],
                            [
                                labelCell('Date de création'),
                                formatDate(rcg.createdAt),
                                labelCell('N° fiche recette'),
                                emptyOrDash(rcg.recipeCardNumber)
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 2. Suivi des pesées
                // ----------------------------------------------------
                {
                    text: '2. SUIVI DES PESÉES',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['28%', '24%', '24%', '24%'],
                        body: [
                            [
                                tableHeader('Type'),
                                tableHeader('Date'),
                                tableHeader('N° pesée'),
                                tableHeader('N° tracteur')
                            ],
                            [
                                { text: 'PREMIÈRE PESÉE', bold: true },
                                formatDate(rcg.firstWeighDate),
                                emptyOrDash(rcg.firstWeighNumber),
                                emptyOrDash(rcg.firstWeighTractorNumber)
                            ],
                            [
                                { text: 'DERNIÈRE PESÉE', bold: true },
                                formatDate(rcg.lastWeighDate),
                                emptyOrDash(rcg.lastWeighNumber),
                                emptyOrDash(rcg.lastWeighTractorNumber)
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 3. Récapitulatif des pesées
                // ----------------------------------------------------
                {
                    text: '3. RÉCAPITULATIF DES PESÉES',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['36%', '21%', '21%', '22%'],
                        body: [
                            [
                                tableHeader('Type de pesée'),
                                tableHeader('À facturer'),
                                tableHeader('Par espèce'),
                                tableHeader('Total')
                            ],
                            [
                                'Pesées complètes',
                                {
                                    text: formatNumber(completeToBill),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(completeBySpecies),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(completeToBill + completeBySpecies),
                                    alignment: 'right',
                                    bold: true
                                }
                            ],
                            [
                                'Pesées incomplètes',
                                {
                                    text: formatNumber(incompleteToBill),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(incompleteBySpecies),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(
                                        incompleteToBill + incompleteBySpecies
                                    ),
                                    alignment: 'right',
                                    bold: true
                                }
                            ],
                            [
                                'Pesées test',
                                {
                                    text: formatNumber(testToBill),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(testBySpecies),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(testToBill + testBySpecies),
                                    alignment: 'right',
                                    bold: true
                                }
                            ],
                            // [
                            //     'Passages sans pesée',
                            //     {
                            //         text: formatNumber(passagesWithoutWeighingToBill),
                            //         alignment: 'center'
                            //     },
                            //     {
                            //         text: formatNumber(passagesWithoutWeighingBySpecies),
                            //         alignment: 'center'
                            //     },
                            //     {
                            //         text: formatNumber(
                            //             passagesWithoutWeighingToBill +
                            //             passagesWithoutWeighingBySpecies
                            //         ),
                            //         alignment: 'right',
                            //         bold: true
                            //     }
                            // ],
                            [
                                'Hors-pont',
                                {
                                    text: '-',
                                    alignment: 'center',
                                    color: '#9CA3AF'
                                },
                                {
                                    text: formatNumber(offBridgeNumber),
                                    alignment: 'center'
                                },
                                {
                                    text: formatNumber(offBridgeNumber),
                                    alignment: 'right',
                                    bold: true
                                }
                            ],
                            [
                                {
                                    text: 'TOTAL',
                                    bold: true,
                                    fillColor: '#E5E7EB'
                                },
                                {
                                    text: formatNumber(totalToBill),
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#E5E7EB'
                                },
                                {
                                    text: formatNumber(totalBySpecies),
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#E5E7EB'
                                },
                                {
                                    text: formatNumber(totalWeighings),
                                    bold: true,
                                    alignment: 'right',
                                    fillColor: '#E5E7EB'
                                }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 5]
                },

                rcg.productionDescription
                    ? {
                        table: {
                            widths: ['20%', '80%'],
                            body: [
                                [
                                    {
                                        text: 'Production',
                                        bold: true,
                                        color: '#166534',
                                        fillColor: '#DCFCE7'
                                    },
                                    {
                                        text: rcg.productionDescription,
                                        color: '#14532D',
                                        fillColor: '#F0FDF4'
                                    }
                                ]
                            ]
                        },
                        layout: 'grid',
                        margin: [0, 0, 0, 10]
                    }
                    : {},

                // ----------------------------------------------------
                // 4. Montants calculés
                // ----------------------------------------------------
                {
                    text: '4. MONTANTS CALCULÉS',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['55%', '45%'],
                        body: [
                            [
                                tableHeader('Désignation'),
                                tableHeader('Montant (FCFA)')
                            ],
                            [
                                'Total pesée en espèce',
                                {
                                    text: formatNumber(
                                        Number(rcg.totalWeightAmount) || 0,
                                        2
                                    ),
                                    alignment: 'right'
                                }
                            ],
                            // [
                            //     'Total pesée à facturer',
                            //     {
                            //         text: formatNumber(
                            //             Number(rcg.totalWeightAmountToBeBilled) || 0,
                            //             // Number('') || 0,
                            //             2
                            //         ),
                            //         alignment: 'right'
                            //     }
                            // ],
                            [
                                'Total pesées test',
                                {
                                    text: formatNumber(
                                        Number(rcg.totalTestWeightAmount) || 0,
                                        2
                                    ),
                                    alignment: 'right'
                                }
                            ],
                            [
                                'Total hors-pont',
                                {
                                    text: formatNumber(
                                        Number(rcg.totalOffBridgeAmount) || 0,
                                        2
                                    ),
                                    alignment: 'right'
                                }
                            ],
                            [
                                {
                                    text: 'CHIFFRE D’AFFAIRES TTC',
                                    bold: true,
                                    color: '#065F46',
                                    fillColor: '#D1FAE5'
                                },
                                {
                                    text: formatNumber(totalRevenue, 2),
                                    bold: true,
                                    alignment: 'right',
                                    color: '#065F46',
                                    fillColor: '#D1FAE5'
                                }
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 5. Incidents
                // ----------------------------------------------------
                {
                    text: '5. INCIDENTS',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            [
                                labelCell('Nombre d’incidents'),
                                formatNumber(Number(rcg.numberIncidents) || 0)
                            ],
                            [
                                labelCell('Description'),
                                Number(rcg.numberIncidents) > 0
                                    ? emptyOrDash(rcg.incidentDescription)
                                    : 'Aucun incident'
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 6. Équipe
                // ----------------------------------------------------
                {
                    text: '6. ÉQUIPE',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['25%', '75%'],
                        body: [
                            [
                                labelCell(`Opérateurs (${operatorsList.length})`),
                                operatorsList.length
                                    ? operatorsList.join(', ')
                                    : 'Aucun opérateur'
                            ],
                            [
                                labelCell(`HSE (${hseList.length})`),
                                hseList.length
                                    ? hseList.join(', ')
                                    : 'Aucun agent HSE'
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 7. Consommables en rupture
                // ----------------------------------------------------
                {
                    text: '7. CONSOMMABLES EN RUPTURE',
                    style: 'sectionHeader'
                },

                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            [
                                labelCell('Nombre'),
                                formatNumber(consumablesList.length)
                            ],
                            [
                                labelCell('Consommables'),
                                consumablesList.length
                                    ? consumablesList.join(', ')
                                    : 'Aucune rupture de consommable'
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0, 0, 0, 10]
                },

                // ----------------------------------------------------
                // 8. CG entrant
                // ----------------------------------------------------
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [
                                {
                                    text: `CG ENTRANT : ${incomingCgName || '-'}`,
                                    bold: true,
                                    alignment: 'center',
                                    color: '#FFFFFF',
                                    fillColor: '#1F2937',
                                    fontSize: 10,
                                    margin: [0, 3, 0, 3]
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [0, 3, 0, 0]
                }
            ],

            styles: {
                title: {
                    fontSize: 15,
                    bold: true,
                    alignment: 'center',
                    color: '#111827'
                },
                subtitle: {
                    fontSize: 8.5,
                    italics: true,
                    color: '#6B7280'
                },
                sectionHeader: {
                    fontSize: 10.5,
                    bold: true,
                    color: '#111827',
                    fillColor: '#F3F4F6',
                    margin: [0, 9, 0, 5]
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        const safeReference = String(rcg.numRef || id).replace(/[\\/:*?"<>|]/g, '_');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `inline; filename="reporting_cg_${safeReference}.pdf"`
        );

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF :', error);

        return res.status(HTTPSTATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: 'server' }])
        );
    }
};