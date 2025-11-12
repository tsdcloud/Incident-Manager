import { ENTITY_API } from "../config.js";
import { 
    createMaintenanceService, 
    deleteMaintenanceService, 
    getAllMaintenanceService, 
    getMaintenanceByIdService,
    getMaintenanceByParams, 
    generateExcelService, 
    updateMaintenanceService, 
    closeMaintenanceService} from "../services/maintenance.service.js";
import HTTP_STATUS from "../utils/http.utils.js";
import { fetchData } from "../utils/fetch.utils.js";
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
export const createMaintenanceController = async (req, res) => {
    try {
        let maintenance = await createMaintenanceService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(maintenance);
        return;
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return
    }
}

/**
 * 
 * @param req
 * @param res 
 * @returns 
 */
export const getMaintenanceByIdController = async (req, res) => {
    let { id } = req.params;
    console.log(id);

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let maintenance = await getMaintenanceByIdService(id);
        res
        .send(maintenance)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const getAllMaintenanceController = async(req, res) => {
    let {authorization}= req.headers;
    let token = authorization.split(' ')[1];
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  maintenances = await getMaintenanceByParams(req.query, token);
            res
            .send(maintenances)
            .status(HTTP_STATUS.OK.statusCode);
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }
    try {
        let maintenances = await getAllMaintenanceService(req.body);
        res
        .send(maintenances)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
export const updateMaintenanceController = async (req, res) => {
    try {
        let maintenance = await updateMaintenanceService(req.params.id, req.body);
        res
        .send(maintenance)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}


/**
 * 
 * @param req 
 * @param res 
 */
export const deleteMaintenanceController = async (req, res) => {
    try {
        let maintenance = await deleteMaintenanceService(req.params.id);
        res
        .send(maintenance)
        .status(HTTP_STATUS.OK.statusCode);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}

export const closeMaintenanceController = async(req, res) =>{
    try {
        let {employeeId, body, params} = req;
        let {id} = params;
        body["validationBy"] = employeeId;
        let maintenance = await closeMaintenanceService(id, body);
        res
        .status(maintenance.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode)
        .send(maintenance);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTP_STATUS.SERVEUR_ERROR.statusCode)
    }
}

export const generateExcelFileController = async (req, res) =>{
    let { authorization } = req.headers;
    let token = authorization?.split(" ")[1];
    let {action} = req.query;

    const exportsDir = path.join(__dirname, '../../', 'exports');
    if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir);
    }

    if(!action){
        try {
            let maintenances = await generateExcelService(req.query);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Rapport maintenance');
            
            worksheet.columns = [
                { header: 'NumRef', key: 'numRef', width: 15 },
                { header: 'Type de maintenance', key: 'maintenance', width: 50 },
                { header: 'Incident', key: 'incident', width: 50 },
                { header: 'Equipement', key: 'equipement', width: 15 },
                { header: 'Site', key: 'site', width: 20 },
                { header: 'description', key: 'description', width: 50 },
                { header: 'Initiateur', key: 'userId', width: 20 },
                { header: 'Intervenant', key: 'supplierId', width: 20 },
                { header: 'Date de creation', key: 'creationDate', width: 20 },
                { header: 'Date de clôture utilisateur', key: 'closedManuDate', width: 20 },
                { header: 'Date de clôture Système', key: 'closedDate', width: 20 },
                { header: 'Durée équipement en minutes', key: 'durationMinEquipment', width: 25 },
                { header: 'Durée système en minutes', key: 'durationMinSystem', width: 25 },
                { header: 'Durée utilisateur en minutes', key: 'durationMinUser', width: 25 },
                { header: 'Date previsionel', key: 'projectedDate', width: 20 },
                { header: 'Prochaine maintenance', key: 'nextMaintenance', width: 20 },
                { header: 'Créé par', key: 'createdBy', width: 20 },
                { header: 'Cloturé par', key: 'closedBy', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
            ];
    
            let employees = await fetchData(`${ENTITY_API}/employees/`, token);
            let suppliers = await fetchData(`${ENTITY_API}/suppliers/`, token);
            let sites = await fetchData(`${ENTITY_API}/sites/`, token);
            let shifts = await fetchData(`${ENTITY_API}/shifts/`, token);

            // Fonction utilitaire pour formater les dates
            const formatDate = (dateString) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return isNaN(date.getTime()) ? "" : date.toLocaleDateString('fr-FR');
            };

            // Fonction utilitaire pour calculer la différence en minutes
            const calculateDuration = (startDate, endDate) => {
                if (!startDate || !endDate) return "N/C";
                
                const start = new Date(startDate);
                const end = new Date(endDate);
                
                if (isNaN(start.getTime()) || isNaN(end.getTime())) return "N/C";
                
                const diffMs = end - start;
                return Math.round(diffMs / (1000 * 60)); // Conversion en minutes
            };
            
            maintenances.forEach(maintenance => {
                // Calcul des durées
                let durationMinEquipment = "N/C";
                let durationMinSystem = "N/C";
                let durationMinUser = "N/C";

                if (maintenance.status === "CLOSED") {
                    if (maintenance.closedManuDate) {
                        durationMinEquipment = calculateDuration(maintenance.createdAt, maintenance.closedManuDate);
                        durationMinUser = calculateDuration(maintenance.createdAt, maintenance.closedManuDate);
                    }
                    if (maintenance.closedDate) {
                        durationMinSystem = calculateDuration(maintenance.createdAt, maintenance.closedDate);
                        // Si pas de closedManuDate, utiliser closedDate pour l'équipement
                        if (!maintenance.closedManuDate) {
                            durationMinEquipment = calculateDuration(maintenance.createdAt, maintenance.closedDate);
                        }
                    }
                }
                worksheet.addRow({
                    numRef: maintenance.numRef,
                    maintenance: maintenance.maintenance || "--",
                    incident: maintenance.incident?.numRef || "--",
                    equipement: maintenance.equipement?.title || "--",
                    site: sites?.data.find(site=>site?.id === maintenance.siteId)?.name || maintenance.siteId,
                    description: maintenance.description,
                    userId: employees?.data.find(employee=>employee?.id === maintenance.createdBy)?.name || maintenance.createdBy,
                    supplierId: employees?.data.find(employee=>employee?.id === maintenance.supplierId)?.name ||suppliers?.data.find(supplier=>supplier?.id === maintenance.supplierId)?.name || maintenance.supplierId,
                    creationDate: formatDate(maintenance.createdAt),
                    closedManuDate: formatDate(maintenance.closedManuDate),
                    closedDate: formatDate(maintenance.closedDate),
                    durationMinEquipment,
                    durationMinSystem,
                    durationMinUser,
                    projectedDate:maintenance.projectedDate,
                    nextMaintenance:maintenance.nextMaintenance,
                    createdBy: employees?.data.find(employee=>employee?.id === maintenance.createdBy)?.name || maintenance.createdBy,
                    closedBy: employees?.data.find(employee=>employee?.id === maintenance.closedBy)?.name || maintenance.closedBy,
                    status: maintenance.status === "PENDING" ? "EN ATTENTE" : "CLOTURE",
                    // effectifDate:maintenance.effectifDate,
                });
            });
    
    
            const filePath = path.join(exportsDir, `maintenances_report.xlsx`);
            await workbook.xlsx.writeFile(filePath);
            const downloadLink = `${ADDRESS}/api/exports/maintenances_report.xlsx`; 
    
            res.status(HTTP_STATUS.OK.statusCode).json({ message: 'File created successfully', downloadLink });
            
        } catch (error) {
            console.log(error);
            res
            .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
        }
    }
}
