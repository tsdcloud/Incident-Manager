import { EMAIL_HOST, ENTITY_API, NODE_ENV } from "../config.js";
import { createIncidentService, deleteIncidentService, generateExcelService, getAllIncidentService, getIncidentByIdService, getIncidentByParams, getStatsService, updateIncidentService } from "../services/incident.service.js";
import { fetchData } from "../utils/fetch.utils.js";
import HTTP_STATUS from "../utils/http.utils.js";
import path from 'path';
import fs from 'fs'
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';
import { differenceInCalendarDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { ADDRESS } from "../config.js";
import { transporter } from "../utils/notification.utils.js";
import { notification } from "../views/mail.view.js";
import { getEmployeesEmail } from "../utils/employees.utils.js";
import { getSubscriptiobListService, sendPushNotification } from "../services/pushNotification.js";

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
        .status(incident.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.CREATED.statusCode)
        .send(incident);
        let employees = await getEmployeesEmail(req.headers.authorization, "manager");
        if(employees){
            let emailList = employees.map(employee => employee.email);
            console.log(emailList);
            let subscriptionList = await getSubscriptiobListService();
            let payload = {
                title: "BERP - INCIDENT",
                subject:"Création d'un incident",
                body:"Un nouvel incident a été créé. \n NumRef :"+incident?.numRef,
                link:"https://berp.bfcgroupsa.com/incidents/",
            };
    
            subscriptionList?.map(sub=>
                sendPushNotification({
                    endpoint: sub.endpoint,
                    keys: sub.keys
                  }, payload)
            )
    
            const mailOptions = {
                from:"no-reply@bfcgroupsa.com",
                to:NODE_ENV === "development"?"belombo@bfclimited.com":emailList,
                subject:"Création d'un incident",
                text:"Un nouvel incident a été créé. \n NumRef :"+incident?.numRef,
                html:notification("Un nouvel incident a été créé. \n NumRef :"+incident?.numRef, "https://berp.bfcgroupsa.com/incidents/")
            };
    
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log("Email sending error: "+error);
                    return
                }
                console.log(info);
            });
        }

        

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
    let {authorization}= req.headers;
    let token = authorization.split(' ')[1];

    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  incidents = await getIncidentByParams(req.query, token);
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
        .status(incident.error ? HTTP_STATUS.BAD_REQUEST.statusCode : HTTP_STATUS.OK.statusCode);
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


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
            
            const headers = [
                'NumRef', 'Date de creation', 'Date de cloture', 
                'Durée en minutes', 
                'Type d\'incident', 'Cause d\'incident', 'Equipement', 
                'Site', 'Shift', 'Initiateur', 'Intervenant/Techn.', 
                'Cloturé par', 'description', 'Édité par', 'Status'
              ];

              worksheet.addRow(headers);
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
                });


            worksheet.columns = [
                { header: 'NumRef', key: 'numRef', width: 15 },
                { header: 'Date de creation', key: 'creationDate', width: 20 },
                { header: 'Date de cloture', key: 'closedDate', width: 20 },
                { header: 'Durée en minutes', key: 'durationMin', width: 50 },
                { header: 'Type d\'incident', key: 'incidentType', width: 50 },
                { header: 'Cause d\'incident', key: 'incidentCause', width: 50 },
                { header: 'Equipement', key: 'equipement', width: 15 },
                { header: 'Site', key: 'site', width: 20 },
                { header: 'Shift', key: 'shift', width: 20 },
                { header: 'Initiateur', key: 'userId', width: 20 },
                { header: 'Intervenant/Techn.', key: 'technician', width: 20 },
                { header: 'Cloturé par', key: 'closedBy', width: 20 },
                { header: 'description', key: 'description', width: 50 },
                { header: 'Édité par', key: 'updatedBy', width: 20 },
                { header: 'Status', key: 'status', width: 20 },
            ];

    
            let employees = await fetchData(`${ENTITY_API}/employees/`, token);
            let suppliers = await fetchData(`${ENTITY_API}/suppliers/`, token);
            let sites = await fetchData(`${ENTITY_API}/sites/`, token);
            let shifts = await fetchData(`${ENTITY_API}/shifts/`, token);
            
            incidents.forEach(incident => {
                worksheet.addRow({
                    numRef: incident.numRef,
                    creationDate: incident.creationDate,
                    closedDate: incident.closedDate,
                    durationMin: incident.status === "CLOSED" ?
                    `${differenceInMinutes(incident.closedDate, incident.creationDate)}` :
                    `N/C`
                    ,
                    incidentType: incident.incident?.name || '',
                    incidentCause: incident.incidentCauses?.name || '',
                    equipement: incident.equipement?.title,
                    site: sites?.data.find(site=>site?.id === incident.siteId)?.name || incident.siteId,
                    shift: shifts?.data.find(shift=>shift?.id === incident.shiftId)?.name || incident.shiftId,
                    userId: employees?.data.find(employee=>employee?.id === incident.createdBy)?.name || incident.createdBy ||"--",
                    technician: employees?.data.find(employee=>employee?.id === incident.technician)?.name || suppliers?.data.find(supplier=>supplier?.id === incident.technician)?.name || incident.technician ||"--",
                    closedBy: employees?.data.find(employee=>employee?.id === incident.closedBy)?.name || incident.closedBy || "--",
                    description: incident.description,
                    status: incident.status === "CLOSED" ? 
                    "CLOTURE" : incident.status === "PENDING" ? 
                    "EN ATTENTE" : incident.status ==="UNDER_MAINTENANCE"?"EN MAINTENANCE":incident.status,
                });
            });


            const filePath = path.join(exportsDir, `incidents_report.xlsx`);
            await workbook.xlsx.writeFile(filePath);
            const downloadLink = `${ADDRESS}/api/exports/incidents_report.xlsx`; 
    
            res.status(HTTP_STATUS.OK.statusCode).json({ message:'File created successfully', downloadLink });
            
        } catch (error) {
            console.log(error);
            res
            .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
        }
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const getStatsController = async (req, res) =>{
    try {
        let stats = await getStatsService();
        res
        .status(HTTP_STATUS.OK.statusCode)
        .send(stats);
        return;
    } catch (error) {
        console.log(error);
        res
        .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
        return;
    }
}