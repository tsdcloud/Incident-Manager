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
//         const currentUserRoles = req.employeeRoles ?? []; // ex: ['head guard'] ou ['OP', 'head guard']

//         // ✅ Restreint SI ET SEULEMENT SI tous les rôles sont dans RESTRICTED_ROLES
//         // (même logique que le frontend)
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

//             worksheet.addRow({
//                 numRef:                                 rcg.numRef                                || "--",
//                 site:                                   siteName,
//                 shift:                                  shiftName,
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

import { EMAIL_HOST, ENTITY_API, NODE_ENV } from "../config.js";

import {
    createReportingCgService,
    deleteReportingCgService,
    getAllReportingCgsService,
    getReportingCgsByParamsService,
    getReportingCgByIdService,
    updateReportingCgService,
    generateExcelReportingCgService
} from "../services/reportingCg.service.js";
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
export const createReportingCgController = async (req, res) => {
    try {
        const result = await createReportingCgService(req.body);
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
export const getReportingCgByIdController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(apiResponse(true, [{ msg: "ID manquant", field: "id" }]));
    }
    try {
        const result = await getReportingCgByIdService(id);
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
export const getAllReportingCgsController = async (req, res) => {
    try {
        const RESTRICTED_ROLES = ['OP', 'head guard'];

        let params = { ...req.query };

        // ✅ Récupérer l'ID et les rôles attachés par le middleware
        const currentUserId   = req.employeeId;
        const currentUserRoles = req.employeeRoles ?? [];

        // ✅ Restreint SI ET SEULEMENT SI tous les rôles sont dans RESTRICTED_ROLES
        const isRestricted =
            currentUserRoles.length > 0 &&
            currentUserRoles.every(r => RESTRICTED_ROLES.includes(r));

        if (isRestricted && currentUserId) {
            params.restrictToUser = currentUserId;
        }

        const result = await getAllReportingCgsService(params);
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
export const updateReportingCgController = async (req, res) => {
    try {
        const result = await updateReportingCgService(req.params.id, req.body);
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
export const deleteReportingCgController = async (req, res) => {
    try {
        const result = await deleteReportingCgService(req.params.id);
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
export const generateExcelReportingCgController = async (req, res) => {
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
        const reportingCgs = await generateExcelReportingCgService(req.query);

        if (!reportingCgs || reportingCgs.length === 0) {
            return res.status(404).json({
                message: 'Aucun reporting CG trouvé pour les critères sélectionnés.'
            });
        }

        // ==================== 4) Création du classeur Excel ====================
        const workbook  = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport CG');

        worksheet.columns = [
            { header: 'Num. Référence',                       key: 'numRef',                                    width: 18 },
            { header: 'Site',                                 key: 'site',                                      width: 20 },
            { header: 'Quart',                                key: 'shift',                                     width: 15 },
            { header: 'CG Entrant',                           key: 'incomingCgId',                              width: 20 },
            { header: 'Opérateurs',                           key: 'operators',                                 width: 30 },
            { header: 'HSE',                                  key: 'hses',                                      width: 30 },
            { header: 'Pesées complètes (à facturer)',        key: 'completeNumberWeighingsToBeBilled',          width: 28 },
            { header: 'Pesées complètes (par espèce)',        key: 'completeNumberWeighingsBySpecies',           width: 28 },
            { header: 'Pesées incomplètes (à facturer)',      key: 'incompleteNumberWeighingsToBeBilled',        width: 28 },
            { header: 'Pesées incomplètes (par espèce)',      key: 'incompleteNumberWeighingsBySpecies',         width: 28 },
            { header: 'Pesées test (à facturer)',             key: 'testNumberWeighingsToBeBilled',              width: 25 },
            { header: 'Pesées test (par espèce)',             key: 'testNumberWeighingsBySpecies',               width: 25 },
            { header: 'Passages sans pesée (à facturer)',     key: 'numberPassagesWithoutWeighingToBeBilled',    width: 30 },
            { header: 'Passages sans pesée (par espèce)',     key: 'numberPassagesWithoutWeighingBySpecies',     width: 30 },
            { header: 'Nombre d\'incidents',                  key: 'numberIncidents',                           width: 20 },
            { header: 'Description incidents',                key: 'incidentDescription',                       width: 40 },
            { header: 'Description production',               key: 'productionDescription',                     width: 40 },
            { header: 'Fichier extraction',                   key: 'extractionFileUrl',                         width: 30 },
            { header: 'Hors-pont (nombre)',                   key: 'offBridgeNumber',                             width: 20 },
            { header: 'Montant total pesée',                  key: 'totalWeightAmount',                           width: 22 },
            { header: 'Montant total pesée à facturer',       key: 'totalWeightAmountToBeBilled',                 width: 28 },
            { header: 'Montant total pesée test',             key: 'totalTestWeightAmount',                       width: 25 },
            { header: 'Montant total hors-pont',              key: 'totalOffBridgeAmount',                        width: 25 },
            { header: 'Consommables en rupture',              key: 'consumables',                                 width: 35 },
            { header: 'Premier n° pesée',                   key: 'firstWeighNumber',                            width: 20 },
            { header: 'Dernier n° pesée',                   key: 'lastWeighNumber',                             width: 20 },
            { header: 'Premier n° tracteur',                key: 'firstWeighTractorNumber',                     width: 20 },
            { header: 'Dernier n° tracteur',                key: 'lastWeighTractorNumber',                      width: 20 },
            { header: 'Date première pesée',                key: 'firstWeighDate',                              width: 22 },
            { header: 'Date dernière pesée',                key: 'lastWeighDate',                               width: 22 },
            { header: 'Créé par',                             key: 'createdBy',                                 width: 20 },
            { header: 'Modifié par',                          key: 'updatedBy',                                 width: 20 },
            { header: 'Date de création',                     key: 'createdAt',                                 width: 20 },
            { header: 'Date de modification',                 key: 'updatedAt',                                 width: 20 },
            { header: 'Actif',                                key: 'isActive',                                  width: 10 },
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
                top:    { style: 'thin' },
                left:   { style: 'thin' },
                bottom: { style: 'thin' },
                right:  { style: 'thin' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // ==================== 5) Données externes (employés, sites, quarts) ====================
        const [employees, sites, shifts] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/sites/`,     token),
            fetchData(`${ENTITY_API}/shifts/`,    token),
        ]);

        // ── Utilitaires ───────────────────────────────────────────────────────
        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
        };

        const findName = (list, id) =>
            list?.data?.find(item => item?.id === id)?.name || id || "--";

        // ==================== 6) Ajout des lignes ====================
        reportingCgs.forEach((rcg) => {
            const siteName  = findName(sites,  rcg.siteId);
            const shiftName = findName(shifts, rcg.shiftId);
            const createdByName = findName(employees, rcg.createdBy);
            const updatedByName = findName(employees, rcg.updatedBy);
            const incomingCgIdName = findName(employees, rcg.incomingCgId);

            // Opérateurs et HSE : liste de noms séparés par virgule
            const operatorNames = rcg.operators?.length
                ? rcg.operators.map(op => findName(employees, op.operatorId)).join(', ')
                : "--";

            const hseNames = rcg.hses?.length
                ? rcg.hses.map(h => findName(employees, h.hseId)).join(', ')
                : "--";

            // Consommables en rupture
            const consumableNames = rcg.outOfStockConsumableReportingCgs?.length
                ? rcg.outOfStockConsumableReportingCgs
                    .map(c => c.consumable?.name || c.consumableId)
                    .filter(Boolean)
                    .join(', ')
                : "--";

            worksheet.addRow({
                numRef:                                 rcg.numRef                                || "--",
                site:                                   siteName,
                shift:                                  shiftName,
                incomingCgId:                           incomingCgIdName                          || "--",
                operators:                              operatorNames,
                hses:                                   hseNames,
                completeNumberWeighingsToBeBilled:      rcg.completeNumberWeighingsToBeBilled     ?? 0,
                completeNumberWeighingsBySpecies:       rcg.completeNumberWeighingsBySpecies      ?? 0,
                incompleteNumberWeighingsToBeBilled:    rcg.incompleteNumberWeighingsToBeBilled   ?? 0,
                incompleteNumberWeighingsBySpecies:     rcg.incompleteNumberWeighingsBySpecies    ?? 0,
                testNumberWeighingsToBeBilled:          rcg.testNumberWeighingsToBeBilled         ?? 0,
                testNumberWeighingsBySpecies:           rcg.testNumberWeighingsBySpecies          ?? 0,
                numberPassagesWithoutWeighingToBeBilled:rcg.numberPassagesWithoutWeighingToBeBilled ?? 0,
                numberPassagesWithoutWeighingBySpecies: rcg.numberPassagesWithoutWeighingBySpecies  ?? 0,
                numberIncidents:                        rcg.numberIncidents                      ?? 0,
                incidentDescription:                    rcg.incidentDescription                  || "--",
                productionDescription:                  rcg.productionDescription                || "--",
                extractionFileUrl:                      rcg.extractionFileUrl                    || "--",
                offBridgeNumber:                        rcg.offBridgeNumber                      ?? 0,
                totalWeightAmount:                      rcg.totalWeightAmount                    ?? 0,
                totalWeightAmountToBeBilled:            rcg.totalWeightAmountToBeBilled          ?? 0,
                totalTestWeightAmount:                  rcg.totalTestWeightAmount                ?? 0,
                totalOffBridgeAmount:                   rcg.totalOffBridgeAmount                 ?? 0,
                consumables:                            consumableNames,
                firstWeighNumber:                       rcg.firstWeighNumber                     || "--",
                lastWeighNumber:                        rcg.lastWeighNumber                      || "--",
                firstWeighTractorNumber:                rcg.firstWeighTractorNumber              || "--",
                lastWeighTractorNumber:                 rcg.lastWeighTractorNumber               || "--",
                firstWeighDate:                         formatDate(rcg.firstWeighDate),
                lastWeighDate:                          formatDate(rcg.lastWeighDate),
                createdBy:                              createdByName,
                updatedBy:                              updatedByName,
                createdAt:                              formatDate(rcg.createdAt),
                updatedAt:                              formatDate(rcg.updatedAt),
                isActive:                               rcg.isActive ? "Oui" : "Non",
            });
        });

        // ── Style lignes de données ───────────────────────────────────────────
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell((cell) => {
                    cell.border = {
                        top:    { style: 'thin' },
                        left:   { style: 'thin' },
                        bottom: { style: 'thin' },
                        right:  { style: 'thin' },
                    };
                });
            }
        });

        // ==================== 7) Sauvegarde & réponse ====================
        const filePath     = path.join(exportsDir, `reporting_cg_report.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        const downloadLink = `${ADDRESS}/api/exports/reporting_cg_report.xlsx`;

        res.status(HTTP_STATUS.OK.statusCode).json({
            message: 'File created successfully',
            downloadLink,
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
    }
};