import { ENTITY_API } from "../config.js";
import { 
    createMaintenanceService, 
    deleteMaintenanceService, 
    getAllMaintenanceService, 
    getMaintenanceByIdService,
    getMaintenanceByParams, 
    generateExcelService, 
    updateMaintenanceService } from "../services/maintenance.service.js";
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
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  maintenances = await getMaintenanceByParams(req.query);
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
                { header: 'Date de creation', key: 'creationDate', width: 20 },
                { header: 'Type de maintenance', key: 'maintenance', width: 50 },
                { header: 'Incident', key: 'incident', width: 50 },
                { header: 'Equipement', key: 'equipement', width: 15 },
                { header: 'Site', key: 'site', width: 20 },
                { header: 'Date previsionel', key: 'projectedDate', width: 20 },
                { header: 'Prochaine maintenance', key: 'nextMaintenance', width: 20 },
                { header: 'description', key: 'description', width: 50 },
                { header: 'Maintenancier', key: 'supplierId', width: 20 },
                { header: 'Chef de guerite', key: 'userId', width: 20 },
                { header: 'Date de cloture', key: 'closedDate', width: 20 },
                { header: 'Créé par', key: 'createdBy', width: 20 },
                { header: 'Édité par', key: 'updatedBy', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
            ];
    
            let employees = await fetchData(`${ENTITY_API}/employees/`, token);
            let sites = await fetchData(`${ENTITY_API}/sites/`, token);
            let shifts = await fetchData(`${ENTITY_API}/shifts/`, token);
            
            maintenances.forEach(maintenance => {
                worksheet.addRow({
                    numRef: maintenance.numRef,
                    creationDate: maintenance.createdAt,
                    maintenance: maintenance.incident?.name || "N/A",
                    incident: maintenance.incident?.name || "N/A",
                    equipement: maintenance.equipement?.name || "N/A",
                    site: sites?.data.find(site=>site?.id === maintenance.siteId)?.name || maintenance.siteId,
                    userId: employees?.data.find(employee=>employee?.id === maintenance.userId)?.name || maintenance.userId,
                    supplierId: employees?.data.find(employee=>employee?.id === maintenance.supplierId)?.name || maintenance.supplierId,
                    projectedDate:maintenance.projectedDate,
                    nextMaintenance:maintenance.nextMaintenance,
                    closedDate:maintenance.closedDate,
                    effectifDate:maintenance.effectifDate,
                    description: maintenance.description,
                    createdBy: employees?.data.find(employee=>employee?.id === maintenance.userId)?.name || maintenance.createdBy,
                    updatedBy: employees?.data.find(employee=>employee?.id === maintenance.userId)?.name || maintenance.updatedBy,
                    status: maintenance.status === "PENDING" ? "EN ATTENTE" : "CLOTURE",
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
