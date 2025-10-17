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
// export const generateExcelFileController = async (req, res) =>{
//     let { authorization } = req.headers;
//     let token = authorization?.split(" ")[1];
//     let {action} = req.query;

//     const exportsDir = path.join(__dirname, '../../', 'exports');
//     if (!fs.existsSync(exportsDir)) {
//         fs.mkdirSync(exportsDir);
//     }

//     if(!action){
//         try {
//             let incidents = await generateExcelService(req.query);
            
//             const workbook = new ExcelJS.Workbook();
//             const worksheet = workbook.addWorksheet('Rapport Incidents');
            
//             const headers = [
//                 'NumRef', 'Date de creation', 'Date de cloture', 
//                 'Durée en minutes', 
//                 'Type d\'incident', 'Cause d\'incident', 'Equipement', 
//                 'Site', 'Shift', 'Initiateur', 'Intervenant/Techn.', 
//                 'Cloturé par', 'description', 'Édité par', 'Status'
//               ];

//               worksheet.addRow(headers);
//               const headerRow = worksheet.getRow(1);
//                 headerRow.eachCell((cell) => {
//                 cell.font = { bold: true };
//                 cell.fill = {
//                     type: 'pattern',
//                     pattern: 'solid',
//                     fgColor: { argb: 'FFD3D3D3' }
//                 };
//                 cell.border = {
//                     top: { style: 'thin' },
//                     left: { style: 'thin' },
//                     bottom: { style: 'thin' },
//                     right: { style: 'thin' }
//                 };
//                 });


//             worksheet.columns = [
//                 { header: 'NumRef', key: 'numRef', width: 15 },
//                 { header: 'Date de creation', key: 'creationDate', width: 20 },
//                 { header: 'Date de cloture', key: 'closedDate', width: 20 },
//                 { header: 'Durée en minutes', key: 'durationMin', width: 50 },
//                 { header: 'Type d\'incident', key: 'incidentType', width: 50 },
//                 { header: 'Cause d\'incident', key: 'incidentCause', width: 50 },
//                 { header: 'Equipement', key: 'equipement', width: 15 },
//                 { header: 'Site', key: 'site', width: 20 },
//                 { header: 'Shift', key: 'shift', width: 20 },
//                 { header: 'Initiateur', key: 'userId', width: 20 },
//                 { header: 'Intervenant/Techn.', key: 'technician', width: 20 },
//                 { header: 'Cloturé par', key: 'closedBy', width: 20 },
//                 { header: 'description', key: 'description', width: 50 },
//                 { header: 'Édité par', key: 'updatedBy', width: 20 },
//                 { header: 'Status', key: 'status', width: 20 },
//             ];

    
//             let employees = await fetchData(`${ENTITY_API}/employees/`, token);
//             let suppliers = await fetchData(`${ENTITY_API}/suppliers/`, token);
//             let sites = await fetchData(`${ENTITY_API}/sites/`, token);
//             let shifts = await fetchData(`${ENTITY_API}/shifts/`, token);
            
//             incidents.forEach(incident => {
//                 worksheet.addRow({
//                     numRef: incident.numRef,
//                     creationDate: incident.creationDate,
//                     closedDate: incident.closedDate,
//                     durationMin: incident.status === "CLOSED" ?
//                     `${differenceInMinutes(incident.closedDate, incident.creationDate)}` :
//                     `N/C`
//                     ,
//                     incidentType: incident.incident?.name || '',
//                     incidentCause: incident.incidentCauses?.name || '',
//                     equipement: incident.equipement?.title,
//                     site: sites?.data.find(site=>site?.id === incident.siteId)?.name || incident.siteId,
//                     shift: shifts?.data.find(shift=>shift?.id === incident.shiftId)?.name || incident.shiftId,
//                     userId: employees?.data.find(employee=>employee?.id === incident.createdBy)?.name || incident.createdBy ||"--",
//                     technician: employees?.data.find(employee=>employee?.id === incident.technician)?.name || suppliers?.data.find(supplier=>supplier?.id === incident.technician)?.name || incident.technician ||"--",
//                     closedBy: employees?.data.find(employee=>employee?.id === incident.closedBy)?.name || incident.closedBy || "--",
//                     description: incident.description,
//                     status: incident.status === "CLOSED" ? 
//                     "CLOTURE" : incident.status === "PENDING" ? 
//                     "EN ATTENTE" : incident.status ==="UNDER_MAINTENANCE"?"EN MAINTENANCE":incident.status,
//                 });
//             });


//             const filePath = path.join(exportsDir, `incidents_report.xlsx`);
//             await workbook.xlsx.writeFile(filePath);
//             const downloadLink = `${ADDRESS}/api/exports/incidents_report.xlsx`; 
    
//             res.status(HTTP_STATUS.OK.statusCode).json({ message:'File created successfully', downloadLink });
            
//         } catch (error) {
//             console.log(error);
//             res
//             .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
//         }
//     }
// }
// export const generateExcelFileController = async (req, res) => {
//     try {
//         // ==================== 1) Authentification & Paramètres ====================
//         let { authorization } = req.headers;
//         let token = authorization?.split(" ")[1]; // Récupère le token du header "Bearer xxx"
//         let { action } = req.query;              // Récupère l'action passée dans la query string

//         // Si un paramètre action est fourni et pas géré, on sort avec une erreur claire
//         if (action && action !== "export") {
//             return res.status(400).json({ message: `Action "${action}" non supportée.` });
//         }

//         // ==================== 2) Préparation du dossier d'exports ====================
//         const exportsDir = path.join(__dirname, '../../', 'exports');
//         if (!fs.existsSync(exportsDir)) {
//             fs.mkdirSync(exportsDir, { recursive: true }); // création récursive sécurisée
//         }

//         // ==================== 3) Récupération des incidents ====================
//         let incidents = await generateExcelService(req.query); // service qui retourne les incidents filtrés
//         console.log(incidents);

//         // ==================== 4) Création du classeur Excel ====================
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Rapport Incidents');

//         // Définition des colonnes (header affiché, clé pour les lignes, largeur de colonne)
//         worksheet.columns = [
//             { header: 'NumRef', key: 'numRef', width: 15 },
//             { header: 'Date de création', key: 'creationDate', width: 20 },
//             { header: 'Date de clôture utilisateur', key: 'closedManuDate', width: 20 },
//             { header: 'Date de clôture Système', key: 'closedDate', width: 20 },
//             { header: 'Durée équimement en minutes', key: 'durationMinEquipment', width: 25 },
//             { header: 'Durée système en minutes', key: 'durationMinSystem', width: 25 },
//             { header: 'Durée utilisateur en minutes', key: 'durationMinUser', width: 25 },
//             { header: 'Type d\'incident', key: 'incidentType', width: 30 },
//             { header: 'Cause d\'incident', key: 'incidentCause', width: 30 },
//             { header: 'Équipement', key: 'equipement', width: 20 },
//             { header: 'Site', key: 'site', width: 20 },
//             { header: 'Shift', key: 'shift', width: 20 },
//             { header: 'Initiateur', key: 'userId', width: 20 },
//             { header: 'Intervenant/Techn.', key: 'technician', width: 25 },
//             { header: 'Clôturé par', key: 'closedBy', width: 20 },
//             { header: 'Description', key: 'description', width: 40 },
//             { header: 'Édité par', key: 'updatedBy', width: 20 },
//             { header: 'Arrêt opération', key: 'hasStoppedOperations', width: 20 },
//             { header: 'Statut', key: 'status', width: 20 },
//         ];

//         // Style du header (première ligne de la feuille)
//         const headerRow = worksheet.getRow(1);
//         headerRow.eachCell((cell) => {
//             cell.font = { bold: true };
//             cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'FFD3D3D3' } // gris clair
//             };
//             cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//             };
//         });

//         // ==================== 5) Récupération des données externes ====================
//         // Appels parallélisés pour optimiser la vitesse
//         const [employees, suppliers, sites, shifts] = await Promise.all([
//             fetchData(`${ENTITY_API}/employees/`, token),
//             fetchData(`${ENTITY_API}/suppliers/`, token),
//             fetchData(`${ENTITY_API}/sites/`, token),
//             fetchData(`${ENTITY_API}/shifts/`, token),
//         ]);

//         // ==================== 6) Ajout des lignes incidents ====================
//         incidents.forEach((incident) => {
//             // Sécurité : parse les dates pour calculer la durée
//             const created = incident.creationDate ? new Date(incident.creationDate) : null;
//             const closedUser = incident.closedManuDate ? new Date(incident.closedManuDate) : null;
//             const closed = incident.closedDate ? new Date(incident.closedDate) : null;

//             // Durée uniquement si l'incident est clôturé et que les deux dates sont valides
//             let durationMinEquipment = "N/C";
//             let durationMinSystem = "N/C";
//             let durationMinUser = "N/C";

//             if (incident.status === "CLOSED" && closed instanceof Date && !isNaN(closed)) {
//                 if (closedUser instanceof Date && !isNaN(closedUser)) {
//                 // ✅ Si closedUser est défini et valide → priorité
//                 durationMinEquipment = differenceInMinutes(closedUser, created);
//                 durationMinUser = differenceInMinutes(closedUser, created);
//                 durationMinSystem = differenceInMinutes(closed, created);
//             } else if (closed instanceof Date && !isNaN(closed)) {
//                 // ✅ Sinon on retombe sur closed
//                 durationMinEquipment = differenceInMinutes(closed, created);
//                 durationMinSystem = differenceInMinutes(closed, created);
//             }
//         }

//             worksheet.addRow({
//                 numRef: incident.numRef,
//                 creationDate: incident.creationDate,
//                 closedManuDate: incident.closedManuDate || "",
//                 closedDate: incident.closedDate,
//                 durationMinEquipment,
//                 durationMinSystem,
//                 durationMinUser,
//                 incidentType: incident.incident?.name || '',
//                 incidentCause: incident.incidentCauses?.name || '',
//                 equipement: incident.equipement?.title || '',
//                 site: sites?.data.find(site => site?.id === incident.siteId)?.name || incident.siteId,
//                 shift: shifts?.data.find(shift => shift?.id === incident.shiftId)?.name || incident.shiftId,
//                 userId: employees?.data.find(emp => emp?.id === incident.createdBy)?.name || incident.createdBy || "--",
//                 technician: employees?.data.find(emp => emp?.id === incident.technician)?.name
//                     || suppliers?.data.find(sup => sup?.id === incident.technician)?.name
//                     || incident.technician || "--",
//                 closedBy: employees?.data.find(emp => emp?.id === incident.closedBy)?.name || incident.closedBy || "--",
//                 description: incident.description || '',
//                 updatedBy: employees?.data.find(emp => emp?.id === incident.updatedBy)?.name || incident.updatedBy || "--",
//                 status: incident.status === "CLOSED" ? "CLOTURÉ" :
//                     incident.status === "PENDING" ? "EN ATTENTE" :
//                     incident.status === "UNDER_MAINTENANCE" ? "EN MAINTENANCE" :
//                     incident.status || "--",
//                 hasStoppedOperations: 
//                     incident.hasStoppedOperations === true ? "1" :
//                     incident.hasStoppedOperations === false ? "0" :
//                     "--",
//             });
//         });

//         // ==================== 7) Sauvegarde du fichier ====================
//         // Nom unique pour éviter les collisions (timestamp)
//         const fileName = `incidents_report_${Date.now()}.xlsx`;
//         const filePath = path.join(exportsDir, fileName);

//         await workbook.xlsx.writeFile(filePath);

//         // Lien de téléchargement construit dynamiquement
//         const downloadLink = `${ADDRESS}/api/exports/${fileName}`;

//         // ==================== 8) Réponse HTTP ====================
//         res.status(HTTP_STATUS.OK.statusCode).json({
//             message: 'Fichier généré avec succès.',
//             downloadLink,
//         });

//     } catch (error) {
//         console.error("Erreur lors de la génération du fichier Excel :", error);
//         res.status(HTTP_STATUS.BAD_REQUEST.statusCode).json({
//             message: "Impossible de générer le fichier Excel.",
//             error: error.message,
//         });
//     }
// };
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

        // ==================== 3) Récupération des incidents ====================
        let incidents = await generateExcelService(req.query);
        
        // Vérifier si des incidents ont été trouvés
        if (!incidents || incidents.length === 0) {
            return res.status(404).json({ 
                message: 'Aucun incident trouvé pour les critères sélectionnés.' 
            });
        }

        // ==================== 4) Création du classeur Excel ====================
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapport Incidents');

        // Définition des colonnes AVEC VOS NOUVELLES COLONNES
        worksheet.columns = [
            { header: 'NumRef', key: 'numRef', width: 15 },
            { header: 'Date de création', key: 'creationDate', width: 20 },
            { header: 'Date de clôture utilisateur', key: 'closedManuDate', width: 20 },
            { header: 'Date de clôture Système', key: 'closedDate', width: 20 },
            { header: 'Durée équipement en minutes', key: 'durationMinEquipment', width: 25 },
            { header: 'Durée système en minutes', key: 'durationMinSystem', width: 25 },
            { header: 'Durée utilisateur en minutes', key: 'durationMinUser', width: 25 },
            { header: 'Type d\'incident', key: 'incidentType', width: 30 },
            { header: 'Cause d\'incident', key: 'incidentCause', width: 30 },
            { header: 'Équipement', key: 'equipement', width: 20 },
            { header: 'Site', key: 'site', width: 20 },
            { header: 'Shift', key: 'shift', width: 20 },
            { header: 'Initiateur', key: 'userId', width: 20 },
            { header: 'Intervenant/Techn.', key: 'technician', width: 25 },
            { header: 'Clôturé par', key: 'closedBy', width: 20 },
            { header: 'Description', key: 'description', width: 40 },
            { header: 'Édité par', key: 'updatedBy', width: 20 },
            { header: 'Arrêt opération', key: 'hasStoppedOperations', width: 20 },
            { header: 'Statut', key: 'status', width: 20 },
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
        const [employees, suppliers, sites, shifts] = await Promise.all([
            fetchData(`${ENTITY_API}/employees/`, token),
            fetchData(`${ENTITY_API}/suppliers/`, token),
            fetchData(`${ENTITY_API}/sites/`, token),
            fetchData(`${ENTITY_API}/shifts/`, token),
        ]);

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

        // ==================== 6) Ajout des lignes incidents ====================
        incidents.forEach((incident) => {
            // Calcul des durées
            let durationMinEquipment = "N/C";
            let durationMinSystem = "N/C";
            let durationMinUser = "N/C";

            if (incident.status === "CLOSED") {
                if (incident.closedManuDate) {
                    durationMinEquipment = calculateDuration(incident.creationDate, incident.closedManuDate);
                    durationMinUser = calculateDuration(incident.creationDate, incident.closedManuDate);
                }
                if (incident.closedDate) {
                    durationMinSystem = calculateDuration(incident.creationDate, incident.closedDate);
                    // Si pas de closedManuDate, utiliser closedDate pour l'équipement
                    if (!incident.closedManuDate) {
                        durationMinEquipment = calculateDuration(incident.creationDate, incident.closedDate);
                    }
                }
            }

            // Recherche des données liées
            const siteName = sites?.data?.find(site => site?.id === incident.siteId)?.name || incident.siteId || "--";
            const shiftName = shifts?.data?.find(shift => shift?.id === incident.shiftId)?.name || incident.shiftId || "--";
            const createdByName = employees?.data?.find(emp => emp?.id === incident.createdBy)?.name || incident.createdBy || "--";
            
            // Intervenant peut être employé ou fournisseur
            let technicianName = "--";
            if (incident.technician) {
                technicianName = employees?.data?.find(emp => emp?.id === incident.technician)?.name 
                    || suppliers?.data?.find(sup => sup?.id === incident.technician)?.name 
                    || incident.technician;
            }

            const closedByName = employees?.data?.find(emp => emp?.id === incident.closedBy)?.name || incident.closedBy || "--";
            const updatedByName = employees?.data?.find(emp => emp?.id === incident.updatedBy)?.name || incident.updatedBy || "--";

            worksheet.addRow({
                numRef: incident.numRef || "--",
                creationDate: formatDate(incident.creationDate),
                closedManuDate: formatDate(incident.closedManuDate),
                closedDate: formatDate(incident.closedDate),
                durationMinEquipment,
                durationMinSystem,
                durationMinUser,
                incidentType: incident.incident?.name || incident.incidentId || "--",
                incidentCause: incident.incidentCauses?.name || incident.incidentCauseId || "--",
                equipement: incident.equipement?.title || incident.equipementId || "--",
                site: siteName,
                shift: shiftName,
                userId: createdByName,
                technician: technicianName,
                closedBy: closedByName,
                description: incident.description || "--",
                updatedBy: updatedByName,
                status: incident.status === "CLOSED" ? "CLOTURÉ" :
                    incident.status === "PENDING" ? "EN ATTENTE" :
                    incident.status === "UNDER_MAINTENANCE" ? "EN MAINTENANCE" :
                    incident.status || "--",
                hasStoppedOperations: 
                    incident.hasStoppedOperations === true ? "Oui" :
                    incident.hasStoppedOperations === false ? "Non" :
                    "--",
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

        // ==================== 7) SAUVEGARDE ET RÉPONSE (identique à l'ancienne version) ====================
        const filePath = path.join(exportsDir, `incidents_report.xlsx`);
        await workbook.xlsx.writeFile(filePath);
        const downloadLink = `${ADDRESS}/api/exports/incidents_report.xlsx`; 

        res.status(HTTP_STATUS.OK.statusCode).json({ message: 'File created successfully', downloadLink });
        
    } catch (error) {
        console.log(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode);
    }
};


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