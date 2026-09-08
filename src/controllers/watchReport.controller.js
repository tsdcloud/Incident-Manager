// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import ExcelJS from 'exceljs';
// import PdfPrinter from 'pdfmake';

// import { ADDRESS, ENTITY_API } from "../config.js";
// import {
//     createWatchReportService,
//     deleteWatchReportService,
//     generateExcelWatchReportService,
//     getAllWatchReportsService,
//     getWatchReportByIdService,
//     updateWatchReportService,
// } from "../services/watchReport.service.js";

// import { apiResponse } from "../utils/apiResponse.js";
// import { fetchData } from "../utils/fetch.utils.js";
// import HTTP_STATUS from "../utils/http.utils.js";

// // ------------------------------------------------------------
// // PATH & LOGO
// // ------------------------------------------------------------
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const standardFonts = {
//     Helvetica: {
//         normal: 'Helvetica',
//         bold: 'Helvetica-Bold',
//         italics: 'Helvetica-Oblique',
//         bolditalics: 'Helvetica-BoldOblique'
//     }
// };
// const printer = new PdfPrinter(standardFonts);

// const headerImagePath = path.join(__dirname, '../../assets/logo_dpws.png');
// let headerImageBase64 = null;
// try {
//     if (fs.existsSync(headerImagePath)) {
//         headerImageBase64 = fs.readFileSync(headerImagePath).toString('base64');
//     }
// } catch (error) {
//     console.warn("Logo PDF introuvable :", error.message);
// }

// // ------------------------------------------------------------
// // HELPERS (formatage, références)
// // ------------------------------------------------------------
// const formatDate = (date) => {
//     if (!date) return '-';
//     const d = new Date(date);
//     return isNaN(d.getTime()) ? '-' : d.toLocaleString('fr-FR');
// };

// const formatDateShort = (date) => {
//     if (!date) return '-';
//     const d = new Date(date);
//     return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
// };

// const formatNumber = (value, decimals = 0) => {
//     if (value === null || value === undefined || value === '') return '-';
//     const num = Number(value);
//     if (isNaN(num)) return '-';
//     return num.toLocaleString('fr-FR', {
//         minimumFractionDigits: decimals,
//         maximumFractionDigits: decimals
//     }).replace(/[\u00A0\u202F]/g, ' ');
// };

// const findEntityName = (response, id) => {
//     if (!id) return '-';
//     const list = response?.data;
//     if (!Array.isArray(list)) return id;
//     const entity = list.find(item => item?.id === id);
//     return entity?.name || id;
// };

// const getPdfReferences = async (token) => {
//     try {
//         const [employees, sites, shifts] = await Promise.all([
//             fetchData(`${ENTITY_API}/employees/`, token),
//             fetchData(`${ENTITY_API}/sites/`, token),
//             fetchData(`${ENTITY_API}/shifts/`, token)
//         ]);
//         return { employees, sites, shifts };
//     } catch (error) {
//         console.error("Erreur chargement références PDF :", error);
//         return { employees: { data: [] }, sites: { data: [] }, shifts: { data: [] } };
//     }
// };

// const getEmployeeName = (employees, id) => findEntityName(employees, id);
// const getSiteName = (sites, id) => findEntityName(sites, id);
// const getShiftName = (shifts, id) => findEntityName(shifts, id);

// // ------------------------------------------------------------
// // CRUD CONTROLLERS
// // ------------------------------------------------------------
// export const createWatchReportController = async (req, res) => {
//     try {
//         const result = await createWatchReportService(req.body);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode;
//         return res.status(status).json(result);
//     } catch (error) {
//         console.error('Erreur création watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// export const getWatchReportByIdController = async (req, res) => {
//     const { id } = req.params;
//     if (!id) {
//         return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(
//             apiResponse(true, [{ msg: "ID manquant", field: "id" }])
//         );
//     }
//     try {
//         const result = await getWatchReportByIdService(id);
//         const status = result.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode;
//         return res.status(status).json(result);
//     } catch (error) {
//         console.error('Erreur récupération watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// export const getAllWatchReportsController = async (req, res) => {
//     try {
//         const result = await getAllWatchReportsService(req.query);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
//         return res.status(status).json(result);
//     } catch (error) {
//         console.error('Erreur récupération watchReports :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// export const updateWatchReportController = async (req, res) => {
//     try {
//         const currentUserRoles = req.employeeRoles ?? [];
//         const canEdit = currentUserRoles.some(r => ['ADMIN','DEX', 'ROP'].includes(r));
//         if (!canEdit) {
//             return res.status(HTTP_STATUS.FORBIDDEN.statusCode).json(
//                 apiResponse(true, [{ msg: "Vous n'avez pas les droits pour modifier ce rapport", field: "authorization" }])
//             );
//         }
//         const result = await updateWatchReportService(req.params.id, req.body);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
//         return res.status(status).json(result);
//     } catch (error) {
//         console.error('Erreur modification watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// export const deleteWatchReportController = async (req, res) => {
//     try {
//         const currentUserRoles = req.employeeRoles ?? [];
//         const canEdit = currentUserRoles.some(r => ['ADMIN','DEX', 'ROP'].includes(r));
//         if (!canEdit) {
//             return res.status(HTTP_STATUS.FORBIDDEN.statusCode).json(
//                 apiResponse(true, [{ msg: "Vous n'avez pas les droits pour modifier ce rapport", field: "authorization" }])
//             );
//         }
//         const result = await deleteWatchReportService(req.params.id);
//         const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
//         return res.status(status).json(result);
//     } catch (error) {
//         console.error('Erreur suppression watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// // ------------------------------------------------------------
// // EXPORT EXCEL
// // ------------------------------------------------------------
// export const generateExcelWatchReportController = async (req, res) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         const exportsDir = path.join(__dirname, '../../exports');
//         if (!fs.existsSync(exportsDir)) {
//             fs.mkdirSync(exportsDir, { recursive: true });
//         }

//         const watchReports = await generateExcelWatchReportService(req.query);

//         if (!watchReports || watchReports.length === 0) {
//             return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json({
//                 message: 'Aucun watchReport trouvé pour les critères sélectionnés.'
//             });
//         }

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('RAPPORT DE QUART');

//         worksheet.columns = [
//             { header: 'Num. Référence', key: 'numRef', width: 18 },
//             { header: 'Site', key: 'site', width: 20 },
//             { header: 'Quart', key: 'shift', width: 15 },
//             { header: 'N° Fiche recette', key: 'recipeCardNumber', width: 15 },
//             { header: 'CG Entrant', key: 'incomingCgId', width: 20 },
//             { header: 'Opérateurs', key: 'operators', width: 30 },
//             { header: 'HSE', key: 'hses', width: 30 },
//             { header: 'Pesées complètes (à facturer)', key: 'completeNumberWeighingsToBeBilled', width: 28 },
//             { header: 'Pesées complètes (par espèce)', key: 'completeNumberWeighingsBySpecies', width: 28 },
//             { header: 'Pesées incomplètes (à facturer)', key: 'incompleteNumberWeighingsToBeBilled', width: 30 },
//             { header: 'Pesées incomplètes (par espèce)', key: 'incompleteNumberWeighingsBySpecies', width: 30 },
//             { header: 'Pesées test (à facturer)', key: 'testNumberWeighingsToBeBilled', width: 25 },
//             { header: 'Pesées test (par espèce)', key: 'testNumberWeighingsBySpecies', width: 25 },
//             { header: 'Pesées prépayées (définitivement réalisées)', key: 'numberPrepaidWeighDefinitivelyCompleted', width: 30 },
//             { header: 'Passages sans pesée (à facturer)', key: 'numberPassagesWithoutWeighingToBeBilled', width: 30 },
//             { header: 'Passages sans pesée (par espèce)', key: 'numberPassagesWithoutWeighingBySpecies', width: 30 },
//             { header: 'Nombre d\'incidents', key: 'numberIncidents', width: 20 },
//             { header: 'Description incidents', key: 'incidentDescription', width: 40 },
//             { header: 'Description production', key: 'productionDescription', width: 40 },
//             { header: 'Fichier extraction', key: 'extractionFileUrl', width: 30 },
//             { header: 'Hors-pont (nombre)', key: 'offBridgeNumber', width: 20 },
//             { header: 'Montant total pesée', key: 'totalWeightAmount', width: 22 },
//             { header: 'Montant total pesée test', key: 'totalTestWeightAmount', width: 25 },
//             { header: 'Montant total hors-pont', key: 'totalOffBridgeAmount', width: 25 },
//             { header: 'Consommables en rupture', key: 'consumables', width: 35 },
//             { header: 'Premier n° pesée', key: 'firstWeighNumber', width: 20 },
//             { header: 'Dernier n° pesée', key: 'lastWeighNumber', width: 20 },
//             { header: 'Premier n° tracteur', key: 'firstWeighTractorNumber', width: 20 },
//             { header: 'Dernier n° tracteur', key: 'lastWeighTractorNumber', width: 20 },
//             { header: 'Date première pesée', key: 'firstWeighDate', width: 22 },
//             { header: 'Date dernière pesée', key: 'lastWeighDate', width: 22 },
//             { header: 'Créé par', key: 'createdBy', width: 20 },
//             { header: 'Modifié par', key: 'updatedBy', width: 20 },
//             { header: 'Date de création', key: 'createdAt', width: 20 },
//             { header: 'Date de modification', key: 'updatedAt', width: 20 },
//             { header: 'Actif', key: 'isActive', width: 10 }
//         ];

//         // Mise en forme de l'en-tête
//         const headerRow = worksheet.getRow(1);
//         headerRow.eachCell(cell => {
//             cell.font = { bold: true };
//             cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };
//             cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//             cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         });

//         const [employees, sites, shifts] = await Promise.all([
//             fetchData(`${ENTITY_API}/employees/`, token),
//             fetchData(`${ENTITY_API}/sites/`, token),
//             fetchData(`${ENTITY_API}/shifts/`, token)
//         ]);

//         watchReports.forEach(wr => {
//             const operatorNames = wr.operators?.length
//                 ? wr.operators.map(op => findEntityName(employees, op.operatorId)).join(', ')
//                 : "--";
//             const hseNames = wr.hses?.length
//                 ? wr.hses.map(h => findEntityName(employees, h.hseId)).join(', ')
//                 : "--";
//             const consumableNames = wr.outOfStockConsumableReportingCgs?.length
//                 ? wr.outOfStockConsumableReportingCgs.map(c => c.consumable?.name || c.consumableId).filter(Boolean).join(', ')
//                 : "--";

//             worksheet.addRow({
//                 numRef: wr.numRef || "--",
//                 site: findEntityName(sites, wr.siteId),
//                 shift: findEntityName(shifts, wr.shiftId),
//                 recipeCardNumber: wr.recipeCardNumber || "--",
//                 incomingCgId: findEntityName(employees, wr.incomingCgId),
//                 operators: operatorNames,
//                 hses: hseNames,
//                 completeNumberWeighingsToBeBilled: wr.completeNumberWeighingsToBeBilled ?? 0,
//                 completeNumberWeighingsBySpecies: wr.completeNumberWeighingsBySpecies ?? 0,
//                 incompleteNumberWeighingsToBeBilled: wr.incompleteNumberWeighingsToBeBilled ?? 0,
//                 incompleteNumberWeighingsBySpecies: wr.incompleteNumberWeighingsBySpecies ?? 0,
//                 testNumberWeighingsToBeBilled: wr.testNumberWeighingsToBeBilled ?? 0,
//                 testNumberWeighingsBySpecies: wr.testNumberWeighingsBySpecies ?? 0,
//                 numberPrepaidWeighDefinitivelyCompleted: wr.numberPrepaidWeighDefinitivelyCompleted ?? 0,
//                 numberPassagesWithoutWeighingToBeBilled: wr.numberPassagesWithoutWeighingToBeBilled ?? 0,
//                 numberPassagesWithoutWeighingBySpecies: wr.numberPassagesWithoutWeighingBySpecies ?? 0,
//                 numberIncidents: wr.numberIncidents ?? 0,
//                 incidentDescription: wr.incidentDescription || "--",
//                 productionDescription: wr.productionDescription || "--",
//                 extractionFileUrl: wr.extractionFileUrl || "--",
//                 offBridgeNumber: wr.offBridgeNumber ?? 0,
//                 totalWeightAmount: wr.totalWeightAmount ?? 0,
//                 totalTestWeightAmount: wr.totalTestWeightAmount ?? 0,
//                 totalOffBridgeAmount: wr.totalOffBridgeAmount ?? 0,
//                 consumables: consumableNames,
//                 firstWeighNumber: wr.firstWeighNumber || "--",
//                 lastWeighNumber: wr.lastWeighNumber || "--",
//                 firstWeighTractorNumber: wr.firstWeighTractorNumber || "--",
//                 lastWeighTractorNumber: wr.lastWeighTractorNumber || "--",
//                 firstWeighDate: formatDateShort(wr.firstWeighDate),
//                 lastWeighDate: formatDateShort(wr.lastWeighDate),
//                 createdBy: findEntityName(employees, wr.createdBy),
//                 updatedBy: findEntityName(employees, wr.updatedBy),
//                 createdAt: formatDate(wr.createdAt),
//                 updatedAt: formatDate(wr.updatedAt),
//                 isActive: wr.isActive ? "Oui" : "Non"
//             });
//         });

//         worksheet.eachRow((row, rowNumber) => {
//             if (rowNumber > 1) {
//                 row.eachCell(cell => {
//                     cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
//                 });
//             }
//         });

//         const filePath = path.join(exportsDir, 'watch_report.xlsx');
//         await workbook.xlsx.writeFile(filePath);

//         return res.status(HTTP_STATUS.OK.statusCode).json({
//             message: 'Fichier Excel créé avec succès',
//             downloadLink: `${ADDRESS}/api/exports/watch_report.xlsx`
//         });

//     } catch (error) {
//         console.error('Erreur génération Excel watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: "server" }])
//         );
//     }
// };

// // ------------------------------------------------------------
// // EXPORT PDF
// // ------------------------------------------------------------
// export const exportPdfWatchReportController = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
//                 error: true,
//                 message: 'ID du watchReport manquant.'
//             });
//         }

//         const authorization = req.headers.authorization;
//         const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : null;
//         if (!token) {
//             return res.status(HTTP_STATUS.UNAUTHORIZED?.statusCode || 401).json({
//                 error: true,
//                 message: 'Token d’authentification manquant.'
//             });
//         }

//         const result = await getWatchReportByIdService(id);
//         if (!result || result.error || !result.data) {
//             return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(
//                 result || { error: true, message: 'WatchReport introuvable.' }
//             );
//         }

//         const wr = result.data;
//         const { employees, sites, shifts } = await getPdfReferences(token);

//         const siteName = getSiteName(sites, wr.siteId);
//         const shiftName = getShiftName(shifts, wr.shiftId);
//         const createdByName = getEmployeeName(employees, wr.createdBy);
//         const incomingCgName = getEmployeeName(employees, wr.incomingCgId);

//         const operatorsList = wr.operators?.length
//             ? wr.operators.map(op => getEmployeeName(employees, op.operatorId)).filter(Boolean)
//             : [];
//         const hseList = wr.hses?.length
//             ? wr.hses.map(hse => getEmployeeName(employees, hse.hseId)).filter(Boolean)
//             : [];
//         const consumablesList = wr.outOfStockConsumableReportingCgs?.length
//             ? wr.outOfStockConsumableReportingCgs.map(item => item.consumable?.name || item.consumableId).filter(Boolean)
//             : [];

//         // Valeurs numériques
//         const completeToBill = Number(wr.completeNumberWeighingsToBeBilled) || 0;
//         const completeBySpecies = Number(wr.completeNumberWeighingsBySpecies) || 0;
//         const incompleteToBill = Number(wr.incompleteNumberWeighingsToBeBilled) || 0;
//         const incompleteBySpecies = Number(wr.incompleteNumberWeighingsBySpecies) || 0;
//         const testToBill = Number(wr.testNumberWeighingsToBeBilled) || 0;
//         const testBySpecies = Number(wr.testNumberWeighingsBySpecies) || 0;
//         const prepaid = Number(wr.numberPrepaidWeighDefinitivelyCompleted) || 0;
//         const offBridgeNumber = Number(wr.offBridgeNumber) || 0;
//         const passagesWithoutWeighingToBill = Number(wr.numberPassagesWithoutWeighingToBeBilled) || 0;
//         const passagesWithoutWeighingBySpecies = Number(wr.numberPassagesWithoutWeighingBySpecies) || 0;

//         const totalToBill = completeToBill + incompleteToBill + testToBill + passagesWithoutWeighingToBill;
//         const totalBySpecies = completeBySpecies + incompleteBySpecies + testBySpecies + passagesWithoutWeighingBySpecies + offBridgeNumber;
//         const totalWeighings = totalToBill + totalBySpecies + prepaid;
//         const totalRevenue = (Number(wr.totalWeightAmount) || 0) + (Number(wr.totalTestWeightAmount) || 0) + (Number(wr.totalOffBridgeAmount) || 0);

//         // Helpers pdfmake
//         const emptyOrDash = (value) => (value === null || value === undefined || value === '') ? '-' : String(value);
//         const labelCell = (text) => ({ text, bold: true, fillColor: '#F3F4F6', color: '#1F2937' });
//         const tableHeader = (text) => ({ text, bold: true, fillColor: '#E5E7EB', color: '#111827', alignment: 'center', margin: [0,3,0,3] });

//         const docDefinition = {
//             defaultStyle: { font: 'Helvetica', fontSize: 8.5, color: '#1F2937' },
//             pageSize: 'A4',
//             pageMargins: [28, 10, 28, 42],
//             header: () => ({
//                 text: `Watch Report${wr.numRef ? ` - ${wr.numRef}` : ''}`,
//                 alignment: 'right',
//                 fontSize: 7,
//                 color: '#9CA3AF',
//                 margin: [0,10,10,0]
//             }),
//             footer: (currentPage, pageCount) => ({
//                 columns: [
//                     { text: `Watch Report - ${wr.numRef || '-'}`, alignment: 'left' },
//                     { text: `Page ${currentPage} / ${pageCount}`, alignment: 'right' }
//                 ],
//                 fontSize: 7,
//                 color: '#6B7280',
//                 margin: [28,0,28,10]
//             }),
//             content: [
//                 headerImageBase64
//                     ? { image: `data:image/png;base64,${headerImageBase64}`, width: 125, alignment: 'center', margin: [0,0,0,5] }
//                     : {},
//                 {
//                     text: `RAPPORT DE QUART - ${emptyOrDash(createdByName) || '-'}`,
//                     style: 'title'
//                 },
//                 {
//                     columns: [
//                         { text: `Référence : ${wr.numRef || '-'}`, style: 'subtitle', alignment: 'left' },
//                         { text: `Date d’édition : ${formatDate(new Date())}`, style: 'subtitle', alignment: 'right' }
//                     ],
//                     margin: [0,3,0,10]
//                 },
//                 // 1. Informations générales
//                 { text: '1. INFORMATIONS GÉNÉRALES', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['18%','32%','18%','32%'],
//                         body: [
//                             [
//                                 labelCell('Référence'), emptyOrDash(wr.numRef),
//                                 labelCell('Initié par'), emptyOrDash(createdByName)
//                             ],
//                             [
//                                 labelCell('Quart'), emptyOrDash(shiftName),
//                                 labelCell('Site'), emptyOrDash(siteName)
//                             ],
//                             [
//                                 labelCell('Date de création'), formatDate(wr.createdAt),
//                                 labelCell('N° fiche recette'), emptyOrDash(wr.recipeCardNumber)
//                             ]
//                         ]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 },
//                 // 2. Suivi des pesées
//                 { text: '2. SUIVI DES PESÉES', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['28%','24%','24%','24%'],
//                         body: [
//                             [ tableHeader('Type'), tableHeader('Date'), tableHeader('N° pesée'), tableHeader('N° tracteur') ],
//                             [ { text: 'PREMIÈRE PESÉE', bold: true }, formatDate(wr.firstWeighDate), emptyOrDash(wr.firstWeighNumber), emptyOrDash(wr.firstWeighTractorNumber) ],
//                             [ { text: 'DERNIÈRE PESÉE', bold: true }, formatDate(wr.lastWeighDate), emptyOrDash(wr.lastWeighNumber), emptyOrDash(wr.lastWeighTractorNumber) ]
//                         ]
//                     },
//                     layout: 'lightHorizontalLines',
//                     margin: [0,0,0,10]
//                 },
//                 // 3. Récapitulatif des pesées
//                 { text: '3. RÉCAPITULATIF DES PESÉES', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['36%','21%','21%','22%'],
//                         body: [
//                             [ tableHeader('Type de pesée'), tableHeader('À facturer'), tableHeader('Par espèce'), tableHeader('Total') ],
//                             [ 'Pesées complètes', { text: formatNumber(completeToBill), alignment: 'center' }, { text: formatNumber(completeBySpecies), alignment: 'center' }, { text: formatNumber(completeToBill+completeBySpecies), alignment: 'right', bold: true } ],
//                             [ 'Pesées incomplètes', { text: formatNumber(incompleteToBill), alignment: 'center' }, { text: formatNumber(incompleteBySpecies), alignment: 'center' }, { text: formatNumber(incompleteToBill+incompleteBySpecies), alignment: 'right', bold: true } ],
//                             [ 'Pesées test', { text: formatNumber(testToBill), alignment: 'center' }, { text: formatNumber(testBySpecies), alignment: 'center' }, { text: formatNumber(testToBill+testBySpecies), alignment: 'right', bold: true } ],
//                             [ 'Pesée prépayée effectuée définitivement', { text: formatNumber(prepaid), alignment: 'center' }, { text: '-', alignment: 'center', color: '#9CA3AF' }, { text: formatNumber(prepaid), alignment: 'right', bold: true } ],
//                             [ 'Hors-pont', { text: '-', alignment: 'center', color: '#9CA3AF' }, { text: formatNumber(offBridgeNumber), alignment: 'center' }, { text: formatNumber(offBridgeNumber), alignment: 'right', bold: true } ],
//                             [
//                                 { text: 'TOTAL', bold: true, fillColor: '#E5E7EB' },
//                                 { text: formatNumber(totalToBill), bold: true, alignment: 'center', fillColor: '#E5E7EB' },
//                                 { text: formatNumber(totalBySpecies), bold: true, alignment: 'center', fillColor: '#E5E7EB' },
//                                 { text: formatNumber(totalWeighings), bold: true, alignment: 'right', fillColor: '#E5E7EB' }
//                             ]
//                         ]
//                     },
//                     layout: 'lightHorizontalLines',
//                     margin: [0, 0, 0, 10]
//                 },
//                 wr.productionDescription ? {
//                     table: {
//                         widths: ['20%','80%'],
//                         body: [[
//                             { text: 'Production', bold: true, color: '#166534', fillColor: '#DCFCE7' },
//                             { text: wr.productionDescription, color: '#14532D', fillColor: '#F0FDF4' }
//                         ]]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 } : {},
//                 // 4. Montants calculés
//                 { text: '4. MONTANTS CALCULÉS', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['55%','45%'],
//                         body: [
//                             [ tableHeader('Désignation'), tableHeader('Montant (FCFA)') ],
//                             [ 'Total pesée en espèce', { text: formatNumber(Number(wr.totalWeightAmount) || 0, 2), alignment: 'right' } ],
//                             [ 'Total pesées test', { text: formatNumber(Number(wr.totalTestWeightAmount) || 0, 2), alignment: 'right' } ],
//                             [ 'Total hors-pont', { text: formatNumber(Number(wr.totalOffBridgeAmount) || 0, 2), alignment: 'right' } ],
//                             [
//                                 { text: 'CHIFFRE D’AFFAIRES TTC', bold: true, color: '#065F46', fillColor: '#D1FAE5' },
//                                 { text: formatNumber(totalRevenue, 2), bold: true, alignment: 'right', color: '#065F46', fillColor: '#D1FAE5' }
//                             ]
//                         ]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 },
//                 // 5. Incidents
//                 { text: '5. INCIDENTS', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['30%','70%'],
//                         body: [
//                             [ labelCell('Nombre d’incidents'), formatNumber(Number(wr.numberIncidents) || 0) ],
//                             [ labelCell('Description'), Number(wr.numberIncidents) > 0 ? emptyOrDash(wr.incidentDescription) : 'Aucun incident' ]
//                         ]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 },
//                 // 6. Équipe
//                 { text: '6. ÉQUIPE', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['25%','75%'],
//                         body: [
//                             [ labelCell(`Opérateurs (${operatorsList.length})`), operatorsList.length ? operatorsList.join(', ') : 'Aucun opérateur' ],
//                             [ labelCell(`HSE (${hseList.length})`), hseList.length ? hseList.join(', ') : 'Aucun agent HSE' ]
//                         ]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 },
//                 // 7. Consommables en rupture
//                 { text: '7. CONSOMMABLES EN RUPTURE', style: 'sectionHeader' },
//                 {
//                     table: {
//                         widths: ['30%','70%'],
//                         body: [
//                             [ labelCell('Nombre'), formatNumber(consumablesList.length) ],
//                             [ labelCell('Consommables'), consumablesList.length ? consumablesList.join(', ') : 'Aucune rupture de consommable' ]
//                         ]
//                     },
//                     layout: 'grid',
//                     margin: [0,0,0,10]
//                 },
//                 // 8. CG entrant
//                 {
//                     table: {
//                         widths: ['100%'],
//                         body: [[
//                             { text: `CG ENTRANT : ${incomingCgName || '-'}`, bold: true, alignment: 'center', color: '#FFFFFF', fillColor: '#1F2937', fontSize: 10, margin: [0,3,0,3] }
//                         ]]
//                     },
//                     layout: 'noBorders',
//                     margin: [0,3,0,0]
//                 }
//             ],
//             styles: {
//                 title: { fontSize: 15, bold: true, alignment: 'center', color: '#111827' },
//                 subtitle: { fontSize: 8.5, italics: true, color: '#6B7280' },
//                 sectionHeader: { fontSize: 10.5, bold: true, color: '#111827', fillColor: '#F3F4F6', margin: [0,9,0,5] }
//             }
//         };

//         const pdfDoc = printer.createPdfKitDocument(docDefinition);
//         const safeReference = String(wr.numRef || id).replace(/[\\/:*?"<>|]/g, '_');
//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', `inline; filename="watch_report_${safeReference}.pdf"`);
//         pdfDoc.pipe(res);
//         pdfDoc.end();

//     } catch (error) {
//         console.error('Erreur génération PDF watchReport :', error);
//         return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
//             apiResponse(true, [{ msg: error.message, field: 'server' }])
//         );
//     }
// };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';

import { ADDRESS, ENTITY_API } from "../config.js";
import {
    createWatchReportService,
    deleteWatchReportService,
    generateExcelWatchReportService,
    getAllWatchReportsService,
    getWatchReportByIdService,
    updateWatchReportService,
} from "../services/watchReport.service.js";

import { apiResponse } from "../utils/apiResponse.js";
import { fetchData } from "../utils/fetch.utils.js";
import HTTP_STATUS from "../utils/http.utils.js";

// ------------------------------------------------------------
// PATH & LOGO
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const standardFonts = {
    Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};
const printer = new PdfPrinter(standardFonts);

const headerImagePath = path.join(__dirname, '../../assets/logo_dpws.png');
let headerImageBase64 = null;
try {
    if (fs.existsSync(headerImagePath)) {
        headerImageBase64 = fs.readFileSync(headerImagePath).toString('base64');
    }
} catch (error) {
    console.warn("Logo PDF introuvable :", error.message);
}

// ------------------------------------------------------------
// HELPERS (formatage, références)
// ------------------------------------------------------------
const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleString('fr-FR');
};

const formatDateShort = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

const formatNumber = (value, decimals = 0) => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return num.toLocaleString('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).replace(/[\u00A0\u202F]/g, ' ');
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
        console.error("Erreur chargement références PDF :", error);
        return { employees: { data: [] }, sites: { data: [] }, shifts: { data: [] } };
    }
};

const getEmployeeName = (employees, id) => findEntityName(employees, id);
const getSiteName = (sites, id) => findEntityName(sites, id);
const getShiftName = (shifts, id) => findEntityName(shifts, id);

// ------------------------------------------------------------
// CRUD CONTROLLERS
// ------------------------------------------------------------
export const createWatchReportController = async (req, res) => {
    try {
        const result = await createWatchReportService(req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur création watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const getWatchReportByIdController = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(
            apiResponse(true, [{ msg: "ID manquant", field: "id" }])
        );
    }
    try {
        const result = await getWatchReportByIdService(id);
        const status = result.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur récupération watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const getAllWatchReportsController = async (req, res) => {
    try {
        const result = await getAllWatchReportsService(req.query);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur récupération watchReports :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const updateWatchReportController = async (req, res) => {
    try {
        const currentUserRoles = req.employeeRoles ?? [];
        const canEdit = currentUserRoles.some(r => ['ADMIN','DEX', 'ROP'].includes(r));
        if (!canEdit) {
            return res.status(HTTP_STATUS.FORBIDDEN.statusCode).json(
                apiResponse(true, [{ msg: "Vous n'avez pas les droits pour modifier ce rapport", field: "authorization" }])
            );
        }
        const result = await updateWatchReportService(req.params.id, req.body);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur modification watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

export const deleteWatchReportController = async (req, res) => {
    try {
        const currentUserRoles = req.employeeRoles ?? [];
        const canEdit = currentUserRoles.some(r => ['ADMIN','DEX', 'ROP'].includes(r));
        if (!canEdit) {
            return res.status(HTTP_STATUS.FORBIDDEN.statusCode).json(
                apiResponse(true, [{ msg: "Vous n'avez pas les droits pour modifier ce rapport", field: "authorization" }])
            );
        }
        const result = await deleteWatchReportService(req.params.id);
        const status = result.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode;
        return res.status(status).json(result);
    } catch (error) {
        console.error('Erreur suppression watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

// ------------------------------------------------------------
// EXPORT EXCEL
// ------------------------------------------------------------
export const generateExcelWatchReportController = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const exportsDir = path.join(__dirname, '../../exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir, { recursive: true });
        }

        const watchReports = await generateExcelWatchReportService(req.query);

        if (!watchReports || watchReports.length === 0) {
            return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json({
                message: 'Aucun watchReport trouvé pour les critères sélectionnés.'
            });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('RAPPORT DE QUART');

        worksheet.columns = [
            { header: 'Num. Référence', key: 'numRef', width: 18 },
            { header: 'Réf Rapport RCG', key: 'numRef_RCG', width: 18 },
            { header: 'CG en objet', key: 'guardhouseSupervisorName', width: 28 },
            { header: 'Date création RCG', key: 'CreaRCG', width: 20 },
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
            // { header: 'Pesées test (à facturer)', key: 'testNumberWeighingsToBeBilled', width: 25 },
            { header: 'Pesées test (par espèce)', key: 'testNumberWeighingsBySpecies', width: 25 },
            { header: 'Pesées prépayées (définitivement réalisées)', key: 'numberPrepaidWeighDefinitivelyCompleted', width: 30 },
            // { header: 'Passages sans pesée (à facturer)', key: 'numberPassagesWithoutWeighingToBeBilled', width: 30 },
            // { header: 'Passages sans pesée (par espèce)', key: 'numberPassagesWithoutWeighingBySpecies', width: 30 },
            { header: 'Nombre d\'incidents', key: 'numberIncidents', width: 20 },
            { header: 'Description incidents', key: 'incidentDescription', width: 40 },
            { header: 'Description production', key: 'productionDescription', width: 40 },
            { header: 'Commentaire support client', key: 'customerSupportComment', width: 40 },
            // { header: 'Fichier extraction', key: 'extractionFileUrl', width: 30 },
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

        // Mise en forme de l'en-tête
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

        watchReports.forEach(wr => {
            const operatorNames = wr.operators?.length
                ? wr.operators.map(op => findEntityName(employees, op.operatorId)).join(', ')
                : "--";
            const hseNames = wr.hses?.length
                ? wr.hses.map(h => findEntityName(employees, h.hseId)).join(', ')
                : "--";
            const consumableNames = wr.outOfStockConsumableReportingCgs?.length
                ? wr.outOfStockConsumableReportingCgs.map(c => c.consumable?.name || c.consumableId).filter(Boolean).join(', ')
                : "--";

            worksheet.addRow({
                numRef: wr.numRef || "--",
                numRef_RCG: wr.reportingCg.numRef || "--",
                guardhouseSupervisorName: findEntityName(employees, wr.guardhouseSupervisorId) || "--",
                CreaRCG: formatDate(wr.reportingCg.createdAt),
                site: findEntityName(sites, wr.siteId),
                shift: findEntityName(shifts, wr.shiftId),
                recipeCardNumber: wr.recipeCardNumber || "--",
                incomingCgId: findEntityName(employees, wr.incomingCgId),
                operators: operatorNames,
                hses: hseNames,
                completeNumberWeighingsToBeBilled: wr.completeNumberWeighingsToBeBilled ?? 0,
                completeNumberWeighingsBySpecies: wr.completeNumberWeighingsBySpecies ?? 0,
                incompleteNumberWeighingsToBeBilled: wr.incompleteNumberWeighingsToBeBilled ?? 0,
                incompleteNumberWeighingsBySpecies: wr.incompleteNumberWeighingsBySpecies ?? 0,
                // testNumberWeighingsToBeBilled: wr.testNumberWeighingsToBeBilled ?? 0,
                testNumberWeighingsBySpecies: wr.testNumberWeighingsBySpecies ?? 0,
                numberPrepaidWeighDefinitivelyCompleted: wr.numberPrepaidWeighDefinitivelyCompleted ?? 0,
                // numberPassagesWithoutWeighingToBeBilled: wr.numberPassagesWithoutWeighingToBeBilled ?? 0,
                // numberPassagesWithoutWeighingBySpecies: wr.numberPassagesWithoutWeighingBySpecies ?? 0,
                numberIncidents: wr.numberIncidents ?? 0,
                incidentDescription: wr.incidentDescription || "--",
                productionDescription: wr.productionDescription || "--",
                customerSupportComment: wr.customerSupportComment || "--",
                // extractionFileUrl: wr.extractionFileUrl || "--",
                offBridgeNumber: wr.offBridgeNumber ?? 0,
                totalWeightAmount: wr.totalWeightAmount ?? 0,
                totalTestWeightAmount: wr.totalTestWeightAmount ?? 0,
                totalOffBridgeAmount: wr.totalOffBridgeAmount ?? 0,
                consumables: consumableNames,
                firstWeighNumber: wr.firstWeighNumber || "--",
                lastWeighNumber: wr.lastWeighNumber || "--",
                firstWeighTractorNumber: wr.firstWeighTractorNumber || "--",
                lastWeighTractorNumber: wr.lastWeighTractorNumber || "--",
                firstWeighDate: formatDateShort(wr.firstWeighDate),
                lastWeighDate: formatDateShort(wr.lastWeighDate),
                createdBy: findEntityName(employees, wr.createdBy),
                updatedBy: findEntityName(employees, wr.updatedBy),
                createdAt: formatDate(wr.createdAt),
                updatedAt: formatDate(wr.updatedAt),
                isActive: wr.isActive ? "Oui" : "Non"
            });
        });

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                row.eachCell(cell => {
                    cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                });
            }
        });

        const filePath = path.join(exportsDir, 'watch_report.xlsx');
        await workbook.xlsx.writeFile(filePath);

        return res.status(HTTP_STATUS.OK.statusCode).json({
            message: 'Fichier Excel créé avec succès',
            downloadLink: `${ADDRESS}/api/exports/watch_report.xlsx`
        });

    } catch (error) {
        console.error('Erreur génération Excel watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: "server" }])
        );
    }
};

// ------------------------------------------------------------
// EXPORT PDF
// ------------------------------------------------------------
export const exportPdfWatchReportController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
                error: true,
                message: 'ID du watchReport manquant.'
            });
        }

        const authorization = req.headers.authorization;
        const token = authorization?.startsWith('Bearer ') ? authorization.split(' ')[1] : null;
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED?.statusCode || 401).json({
                error: true,
                message: 'Token d’authentification manquant.'
            });
        }

        const result = await getWatchReportByIdService(id);
        if (!result || result.error || !result.data) {
            return res.status(HTTP_STATUS.NOT_FOUND.statusCode).json(
                result || { error: true, message: 'WatchReport introuvable.' }
            );
        }

        const wr = result.data;
        const { employees, sites, shifts } = await getPdfReferences(token);

        const siteName = getSiteName(sites, wr.siteId);
        const shiftName = getShiftName(shifts, wr.shiftId);
        const createdByName = getEmployeeName(employees, wr.createdBy);
        const incomingCgName = getEmployeeName(employees, wr.incomingCgId);
        const guardhouseSupervisorName = getEmployeeName(employees, wr.guardhouseSupervisorId);
        const reportingCgNumRef = wr.reportingCg?.numRef || wr.reportingCgId || '-';
        const reportingCgCreationDate = wr.reportingCg?.createdAt ? formatDate(wr.reportingCg.createdAt) : '-';

        const operatorsList = wr.operators?.length
            ? wr.operators.map(op => getEmployeeName(employees, op.operatorId)).filter(Boolean)
            : [];
        const hseList = wr.hses?.length
            ? wr.hses.map(hse => getEmployeeName(employees, hse.hseId)).filter(Boolean)
            : [];
        const consumablesList = wr.outOfStockConsumableReportingCgs?.length
            ? wr.outOfStockConsumableReportingCgs.map(item => item.consumable?.name || item.consumableId).filter(Boolean)
            : [];

        // Valeurs numériques
        const completeToBill = Number(wr.completeNumberWeighingsToBeBilled) || 0;
        const completeBySpecies = Number(wr.completeNumberWeighingsBySpecies) || 0;
        const incompleteToBill = Number(wr.incompleteNumberWeighingsToBeBilled) || 0;
        const incompleteBySpecies = Number(wr.incompleteNumberWeighingsBySpecies) || 0;
        const testToBill = Number(wr.testNumberWeighingsToBeBilled) || 0;
        const testBySpecies = Number(wr.testNumberWeighingsBySpecies) || 0;
        const prepaid = Number(wr.numberPrepaidWeighDefinitivelyCompleted) || 0;
        const offBridgeNumber = Number(wr.offBridgeNumber) || 0;
        const passagesWithoutWeighingToBill = Number(wr.numberPassagesWithoutWeighingToBeBilled) || 0;
        const passagesWithoutWeighingBySpecies = Number(wr.numberPassagesWithoutWeighingBySpecies) || 0;

        const totalToBill = completeToBill + incompleteToBill + testToBill + passagesWithoutWeighingToBill;
        const totalBySpecies = completeBySpecies + incompleteBySpecies + testBySpecies + passagesWithoutWeighingBySpecies + offBridgeNumber;
        const totalWeighings = totalToBill + totalBySpecies + prepaid;
        const totalRevenue = (Number(wr.totalWeightAmount) || 0) + (Number(wr.totalTestWeightAmount) || 0) + (Number(wr.totalOffBridgeAmount) || 0);

        // Helpers pdfmake
        const emptyOrDash = (value) => (value === null || value === undefined || value === '') ? '-' : String(value);
        const labelCell = (text) => ({ text, bold: true, fillColor: '#F3F4F6', color: '#1F2937' });
        const tableHeader = (text) => ({ text, bold: true, fillColor: '#E5E7EB', color: '#111827', alignment: 'center', margin: [0,3,0,3] });

        const docDefinition = {
            defaultStyle: { font: 'Helvetica', fontSize: 8.5, color: '#1F2937' },
            pageSize: 'A4',
            pageMargins: [28, 10, 28, 42],
            header: () => ({
                text: `Watch Report${wr.numRef ? ` - ${wr.numRef}` : ''}`,
                alignment: 'right',
                fontSize: 7,
                color: '#9CA3AF',
                margin: [0,10,10,0]
            }),
            footer: (currentPage, pageCount) => ({
                columns: [
                    { text: `Watch Report - ${wr.numRef || '-'}`, alignment: 'left' },
                    { text: `Page ${currentPage} / ${pageCount}`, alignment: 'right' }
                ],
                fontSize: 7,
                color: '#6B7280',
                margin: [28,0,28,10]
            }),
            content: [
                headerImageBase64
                    ? { image: `data:image/png;base64,${headerImageBase64}`, width: 125, alignment: 'center', margin: [0,0,0,5] }
                    : {},
                {
                    text: `RAPPORT DE QUART DE : ${emptyOrDash(guardhouseSupervisorName) || '-'}`,
                    style: 'title'
                },
                {
                    columns: [
                        { text: `Référence : ${wr.numRef || '-'}`, style: 'subtitle', alignment: 'left' },
                        { text: `Date d’édition : ${formatDate(new Date())}`, style: 'subtitle', alignment: 'right' }
                    ],
                    margin: [0,3,0,10]
                },
                // 1. Informations générales
                { text: '1. INFORMATIONS GÉNÉRALES', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['18%','32%','18%','32%'],
                        body: [
                            [
                                labelCell('N°Référence RCG'), emptyOrDash(reportingCgNumRef),
                                labelCell('Initiateur du RCG'), emptyOrDash(guardhouseSupervisorName),
                            ],
                            [
                                labelCell('Quart'), emptyOrDash(shiftName),
                                labelCell('Site'), emptyOrDash(siteName)
                            ],
                            [
                                labelCell('RCG créé  le'), emptyOrDash(reportingCgCreationDate),
                                labelCell('N° fiche recette'), emptyOrDash(wr.recipeCardNumber)
                            ],
                            [
                                labelCell('Initiateur du RQ'), emptyOrDash(createdByName),
                                labelCell('RQ créé  le'), formatDate(wr.createdAt)
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },
                // 2. Suivi des pesées
                { text: '2. SUIVI DES PESÉES', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['28%','24%','24%','24%'],
                        body: [
                            [ tableHeader('Type'), tableHeader('Date'), tableHeader('N° pesée'), tableHeader('N° tracteur') ],
                            [ { text: 'PREMIÈRE PESÉE', bold: true }, formatDate(wr.firstWeighDate), emptyOrDash(wr.firstWeighNumber), emptyOrDash(wr.firstWeighTractorNumber) ],
                            [ { text: 'DERNIÈRE PESÉE', bold: true }, formatDate(wr.lastWeighDate), emptyOrDash(wr.lastWeighNumber), emptyOrDash(wr.lastWeighTractorNumber) ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0,0,0,10]
                },
                // 3. Récapitulatif des pesées
                { text: '3. RÉCAPITULATIF DES PESÉES', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['36%','21%','21%','22%'],
                        body: [
                            [ tableHeader('Type de pesée'), tableHeader('À facturer'), tableHeader('Par espèce'), tableHeader('Total') ],
                            [ 'Pesées complètes', { text: formatNumber(completeToBill), alignment: 'center' }, { text: formatNumber(completeBySpecies), alignment: 'center' }, { text: formatNumber(completeToBill+completeBySpecies), alignment: 'right', bold: true } ],
                            [ 'Pesées incomplètes', { text: formatNumber(incompleteToBill), alignment: 'center' }, { text: formatNumber(incompleteBySpecies), alignment: 'center' }, { text: formatNumber(incompleteToBill+incompleteBySpecies), alignment: 'right', bold: true } ],
                            [ 'Pesées test', { text: formatNumber(testToBill), alignment: 'center' }, { text: formatNumber(testBySpecies), alignment: 'center' }, { text: formatNumber(testToBill+testBySpecies), alignment: 'right', bold: true } ],
                            [ 'Pesée prépayée effectuée définitivement', { text: formatNumber(prepaid), alignment: 'center' }, { text: '-', alignment: 'center', color: '#9CA3AF' }, { text: formatNumber(prepaid), alignment: 'right', bold: true } ],
                            [ 'Hors-pont', { text: '-', alignment: 'center', color: '#9CA3AF' }, { text: formatNumber(offBridgeNumber), alignment: 'center' }, { text: formatNumber(offBridgeNumber), alignment: 'right', bold: true } ],
                            [
                                { text: 'TOTAL', bold: true, fillColor: '#E5E7EB' },
                                { text: formatNumber(totalToBill), bold: true, alignment: 'center', fillColor: '#E5E7EB' },
                                { text: formatNumber(totalBySpecies), bold: true, alignment: 'center', fillColor: '#E5E7EB' },
                                { text: formatNumber(totalWeighings), bold: true, alignment: 'right', fillColor: '#E5E7EB' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 10]
                },
                wr.productionDescription ? {
                    table: {
                        widths: ['20%','80%'],
                        body: [[
                            { text: 'Production', bold: true, color: '#166534', fillColor: '#DCFCE7' },
                            { text: wr.productionDescription, color: '#14532D', fillColor: '#F0FDF4' }
                        ]]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                } : {},
                // 4. Montants calculés
                { text: '4. MONTANTS CALCULÉS', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['55%','45%'],
                        body: [
                            [ tableHeader('Désignation'), tableHeader('Montant (FCFA)') ],
                            [ 'Total pesée en espèce', { text: formatNumber(Number(wr.totalWeightAmount) || 0, 2), alignment: 'right' } ],
                            [ 'Total pesées test', { text: formatNumber(Number(wr.totalTestWeightAmount) || 0, 2), alignment: 'right' } ],
                            [ 'Total hors-pont', { text: formatNumber(Number(wr.totalOffBridgeAmount) || 0, 2), alignment: 'right' } ],
                            [
                                { text: 'CHIFFRE D’AFFAIRES TTC', bold: true, color: '#065F46', fillColor: '#D1FAE5' },
                                { text: formatNumber(totalRevenue, 2), bold: true, alignment: 'right', color: '#065F46', fillColor: '#D1FAE5' }
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },
                // 5. Incidents
                { text: '5. INCIDENTS', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['30%','70%'],
                        body: [
                            [ labelCell('Nombre d’incidents'), formatNumber(Number(wr.numberIncidents) || 0) ],
                            [ labelCell('Description'), Number(wr.numberIncidents) > 0 ? emptyOrDash(wr.incidentDescription) : 'Aucun incident' ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },
                // 6. Équipe
                { text: '6. ÉQUIPE', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['25%','75%'],
                        body: [
                            [ labelCell(`Opérateurs (${operatorsList.length})`), operatorsList.length ? operatorsList.join(', ') : 'Aucun opérateur' ],
                            [ labelCell(`HSE (${hseList.length})`), hseList.length ? hseList.join(', ') : 'Aucun agent HSE' ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },
                // 7. Commentaire support client
                { text: '7. COMMENTAIRE SUPPORT CLIENT', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['100%'],
                        body: [
                            [
                                {
                                    text: wr.customerSupportComment && wr.customerSupportComment.trim()
                                        ? wr.customerSupportComment
                                        : 'RAS',
                                    color: '#0C4A6E',
                                    fillColor: '#F0F9FF'
                                }
                            ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },

                // 8. Consommables en rupture
                { text: '8. CONSOMMABLES EN RUPTURE', style: 'sectionHeader' },
                {
                    table: {
                        widths: ['30%','70%'],
                        body: [
                            [ labelCell('Nombre'), formatNumber(consumablesList.length) ],
                            [ labelCell('Consommables'), consumablesList.length ? consumablesList.join(', ') : 'Aucune rupture de consommable' ]
                        ]
                    },
                    layout: 'grid',
                    margin: [0,0,0,10]
                },
                // 8. CG entrant
                {
                    table: {
                        widths: ['100%'],
                        body: [[
                            { text: `CG ENTRANT : ${incomingCgName || '-'}`, bold: true, alignment: 'center', color: '#FFFFFF', fillColor: '#1F2937', fontSize: 10, margin: [0,3,0,3] }
                        ]]
                    },
                    layout: 'noBorders',
                    margin: [0,3,0,0]
                }
            ],
            styles: {
                title: { fontSize: 15, bold: true, alignment: 'center', color: '#111827' },
                subtitle: { fontSize: 8.5, italics: true, color: '#6B7280' },
                sectionHeader: { fontSize: 10.5, bold: true, color: '#111827', fillColor: '#F3F4F6', margin: [0,9,0,5] }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const safeReference = String(wr.numRef || id).replace(/[\\/:*?"<>|]/g, '_');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="watch_report_${safeReference}.pdf"`);
        pdfDoc.pipe(res);
        pdfDoc.end();

    } catch (error) {
        console.error('Erreur génération PDF watchReport :', error);
        return res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json(
            apiResponse(true, [{ msg: error.message, field: 'server' }])
        );
    }
};