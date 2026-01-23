import { createOperationService, getAllOperationsService, getOperationByIdService, getOperationsByParamsService, updateOperationService, deleteOperationService, generateExcelService } from "../services/operation.service.js";
import { apiResponse } from "../utils/apiResponse.js";
import HTTP_STATUS from "../utils/http.utils.js";
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import { fetchData } from "../utils/fetch.utils.js";
import { ADDRESS, ENTITY_API } from "../config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



/**
 * Create operation controller
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createOperationController = async(req, res) =>{
    try {
        let body = req.body;

        let actionType = await createOperationService(body);
        res
        .status(actionType.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(actionType);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}



/**
 * Get all the operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getAllOperationController = async(req, res)=>{
    try {
        if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
            try {
                let  operation = await getOperationsByParamsService(req.query);
                res
                .status(operation?.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
                .send(operation);
                return;
            } catch (error) {
              console.log(error);
              res
              .status(HTTP_STATUS.SERVEUR_ERROR.statusCode)
              .send(apiResponse(true, [{message:`${error}`, field:'server'}]));
              return;
            }
        }
        let operation = await getAllOperationsService();
        res
        .status(operation.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Get operation by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getOperationByIdController = async(req, res) =>{
    try {
        let {id} = req.params;
        let operation = await getOperationByIdService(id);
        res
        .status(operation.error ? HTTP_STATUS.NOT_FOUND.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Update operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const updateOperationController = async(req, res)=>{
    try {
        let {id} = req.params;
        let body = req.body;
        let operation = await updateOperationService(id, body);
        res
        .status(operation.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(operation);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}


/**
 * Delete operation
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const deleteOperationController = async(req, res) =>{
    try {
        let {id} = req.params;
        let actionType = await deleteOperationService(id);
        res
        .status(actionType.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.NO_CONTENT.statusCode)
        .send(actionType);
    } catch (error) {
        console.log(error);
        return apiResponse(true, [{message:`${error}`, field:'server'}]);
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export const generateExcelFileController = async (req, res) => {
    try {
        // ==================== 1) Authentification & Paramètres ====================
        let { authorization } = req.headers;
        let token = authorization?.split(" ")[1];

        // ==================== 2) Préparation du dossier d'exports ====================
        const exportsDir = path.join(__dirname, '../../', 'exports');
        if (!fs.existsSync(exportsDir)) {
            fs.mkdirSync(exportsDir);
        }

        // ==================== 3) Récupération des operation_ges ====================
        let operation_ges = await generateExcelService(req.query);
        
        // Vérifier si des operation_ges ont été trouvés
        if (!operation_ges || operation_ges.length === 0) {
            return res.status(404).json({ 
                message: 'Aucun operation_ge trouvé pour les critères sélectionnés.' 
            });
        }

        // ==================== 4) Création du classeur Excel ====================
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport operation_ges');

        // Définition des colonnes AVEC VOS NOUVELLES COLONNES
        // CORRECTION: 'userId' n'existe pas, utilisez 'initiateur'
        worksheet.columns = [
            { header: 'Site', key: 'site', width: 20 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Équipement', key: 'equipement', width: 20 },
            { header: 'Domaine', key: 'domain', width: 20 },
            { header: 'Type d\'action', key: 'actionType', width: 20 },
            { header: 'Quantité en litre', key: 'content', width: 40 },
            { header: 'Initiateur', key: 'initiateur', width: 20 }, // Changé de 'userId' à 'initiateur'
            { header: 'Date de création', key: 'createdAt', width: 20 },
            { header: 'Modifié par', key: 'updatedBy', width: 20 },
            { header: 'Date de MAJ', key: 'updatedAt', width: 20 },
        ];

        // Style du header (identique à l'ancienne version)
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD3D3D3' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // ==================== 5) Récupération des données externes ====================
        const [employees, sites] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/sites/`, token),
        ]);

        // Fonction utilitaire pour formater les dates
        const formatDate = (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
        };

        // ==================== 6) Ajout des lignes operation_ges ====================
        operation_ges.forEach((operation_ge) => {
            
            // Recherche des données liées
            const siteName = sites?.data?.find(site => site?.id === operation_ge.siteId)?.name || operation_ge.siteId || "--";
            const createdByName = employees?.data?.find(emp => emp?.id === operation_ge.createdBy)?.name || operation_ge.createdBy || "--";
            const updatedByName = employees?.data?.find(emp => emp?.id === operation_ge.updatedBy)?.name || operation_ge.updatedBy || "--";
            const domain = operation_ge.equipement?.equipmentGroup?.equipmentGroupFamily?.domain 
                || operation_ge.equipement?.equipmentGroup?.equipmentGroupFamily?.domaine  // au cas où le champ s'appelle "domaine" au lieu de "domain"
                || "--";
            
            // CORRECTION: Utilisez 'initiateur' au lieu de 'userId'
            worksheet.addRow({
                site: siteName,
                description: operation_ge.description || "--",
                equipement: operation_ge.equipement?.title || operation_ge.equipementId || "--",
                domain: domain,
                actionType: operation_ge.actionType === "START" ? "DEMARRAGE" :
                    operation_ge.actionType === "STOP" ? "ARRET" :
                    operation_ge.actionType === "REFUEL" ? "RECHARGE" :
                    operation_ge.actionType || "--",
                content: operation_ge.content || "--",
                initiateur: createdByName, // Changé de 'userId' à 'initiateur'
                createdAt: formatDate(operation_ge.createdAt),
                updatedBy: updatedByName,
                updatedAt: formatDate(operation_ge.updatedAt),
            });
        });

        // Appliquer un style aux lignes de données
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Skip header row
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }
        });

        // ==================== 7) SAUVEGARDE ET RÉPONSE ====================
        const filePath = path.join(exportsDir, `operation_ge_export.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        
        const downloadLink = `${ADDRESS}/api/exports/operation_ge_export.xlsx`;

        res.status(HTTP_STATUS.OK.statusCode).json({ 
            message: 'File created successfully', 
            downloadLink 
        });
        
    } catch (error) {
        console.log("Error in generateExcelFileController:", error);
        res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({ 
            message: 'Error generating Excel file',
            error: error.message 
        });
    }
};