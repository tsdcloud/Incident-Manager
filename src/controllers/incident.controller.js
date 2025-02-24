import { ENTITY_API } from "../config.js";
import { createIncidentService, deleteIncidentService, generateExcelService, getAllIncidentService, getIncidentByIdService, getIncidentByParams, updateIncidentService } from "../services/incident.service.js";
import { fetchData } from "../utils/fetch.utils.js";
import HTTP_STATUS from "../utils/http.utils.js";
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const createIncidentController = async (req, res) => {
    try {
        let incident = await createIncidentService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(incident);
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
export const getIncidentByIdController = async (req, res) => {
    let { id } = req.params;

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let incident = await getIncidentByIdService(id);
        res
        .send(incident)
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
export const getAllIncidentController = async(req, res) => {
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  incidents = await getIncidentByParams(req.query);
            res
            .send(incidents)
            .status(HTTP_STATUS.OK.statusCode);
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }
    try {
        let incidents = await getAllIncidentService(req.body);
        res
        .send(incidents)
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
export const updateIncidentController = async (req, res) => {
    try {
        let incident = await updateIncidentService(req.params.id, req.body);
        res
        .send(incident)
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
export const deleteIncidentController = async (req, res) => {
    try {
        let incident = await deleteIncidentService(req.params.id);
        res
        .send(incident)
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
            let incidents = await generateExcelService(req.query);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Rapport Incidents');
            
            worksheet.columns = [
                { header: 'NumRef', key: 'numRef', width: 15 },
                { header: 'Date de creation', key: 'creationDate', width: 20 },
                { header: 'Type d\'incident', key: 'incidentType', width: 50 },
                { header: 'Cause d\'incident', key: 'incidentCause', width: 50 },
                { header: 'Equipement', key: 'equipement', width: 15 },
                { header: 'Site', key: 'site', width: 20 },
                { header: 'Shift', key: 'shift', width: 20 },
                { header: 'Utilisateur', key: 'userId', width: 20 },
                { header: 'description', key: 'description', width: 50 },
                { header: 'Édité par', key: 'updatedBy', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
            ];
    
            let employees = await fetchData(`${ENTITY_API}/employees/`, token);
            let sites = await fetchData(`${ENTITY_API}/sites/`, token);
            let shifts = await fetchData(`${ENTITY_API}/shifts/`, token);

            incidents.forEach(incident => {
                worksheet.addRow({
                    numRef: incident.numRef,
                    creationDate: incident.creationDate,
                    incidentType: incident.incident.name,
                    incidentCause: incident.incidentCauses.name,
                    equipement: incident.equipement.name,
                    site: sites?.data.find(site=>site?.id === incident.siteId)?.name || incident.siteId,
                    shift: shifts?.data.find(shift=>shift?.id === incident.shiftId)?.name || incident.shiftId,
                    userId: employees?.data.find(employee=>employee?.id === incident.createdBy)?.name || incident.createdBy,
                    description: incident.description,
                    status: incident.status === "CLOSED" ? 
                    "CLOTURE" : incident.status === "PENDING" ? 
                    "EN ATTENTE" : incident.status ==="UNDER_MAINTENANCE"?"EN MAINTENANCE":incident.status,
                });
            });
    
            const filePath = path.join(exportsDir, `incidents_report.xlsx`);
            await workbook.xlsx.writeFile(filePath);
            const downloadLink = `${req.protocol}://${req.get('host')}/api/exports/incidents_report.xlsx`; 
    
            res.status(HTTP_STATUS.OK.statusCode).json({ message:'File created successfully', downloadLink });
            
        } catch (error) {
            console.log(error);
            res
            .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
        }
    }
}
