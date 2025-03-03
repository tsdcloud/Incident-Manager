import { ENTITY_API } from "../config.js";
import { 
    createOffBridgeService, 
    deleteOffBridgeService, 
    generateExcelService, 
    getAllOffBridgeService, 
    getOffBridgeByIdService, 
    getOffBridgeByParams, 
    updateOffBridgeService 
} from "../services/offBridge.service.js";
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
export const createOffBridgeController = async (req, res) => {
    try {
        let offBridge = await createOffBridgeService(req.body);
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .send(offBridge);
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
export const getOffBridgeByIdController = async (req, res) => {
    let { id } = req.params;

    if(!id){
        res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
        return;
    }

    try {
        let offBridge = await getOffBridgeByIdService(id);
        res
        .send(offBridge)
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
export const getAllOffBridgeController = async(req, res) => {
    
    if(Object.keys(req.query).length !== 0 && req.query.constructor === Object){
        try {
            let  offBridges = await getOffBridgeByParams(req.query);
            res
            .send(offBridges)
            .status(HTTP_STATUS.OK.statusCode);
            return;
        } catch (error) {
          console.log(error);
          res.sendStatus(HTTP_STATUS.NOT_FOUND.statusCode);
          return;
        }
    }

    try {
        let offBridges = await getAllOffBridgeService(req.body);
        res
        .send(offBridges)
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
export const updateOffBridgeController = async (req, res) => {
    try {
        let offBridge = await updateOffBridgeService(req.params.id, req.body);
        res
        .send(offBridge)
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
export const deleteOffBridgeController = async (req, res) => {
    try {
        let incident = await deleteOffBridgeService(req.params.id);
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
            let offBridges = await generateExcelService(req.query);
            
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Rapport Hors pont');
            
            worksheet.columns = [
                { header: 'NumRef', key: 'numRef', width: 15 },
                { header: 'Date de creation', key: 'createdAt', width: 20 },
                { header: 'Cause de l\'incident', key: 'incidentCause', width: 20 },
                { header: 'Site', key: 'siteId', width: 20 },
                { header: 'Tier', key: 'tier', width: 20 },
                { header: 'Conteneur 1', key: 'container1', width: 20 },
                { header: 'Conteneur 2', key: 'container2', width: 20 },
                { header: 'Plomb 1', key: 'plomb1', width: 20 },
                { header: 'Plomb 2', key: 'plomb2', width: 20 },
                { header: 'Chargeur', key: 'loader', width: 20 },
                { header: 'Produit', key: 'product', width: 20 },
                { header: 'Transporteur', key: 'transporter', width: 20 },
                { header: 'Vehicule', key: 'vehicle', width: 20 },
                { header: 'Numero BL', key: 'blNumber', width: 20 },
                { header: 'Chauffeur', key: 'driver', width: 20 },
                { header: 'Remorque', key: 'trailer', width: 20 },
                { header: 'Initier par', key: 'createdBy', width: 20 }
            ];
    
            let employees = await fetchData(`${ENTITY_API}/employees/`, token);
            let sites = await fetchData(`${ENTITY_API}/sites/`, token);
            
            offBridges.forEach(offBridge => {
                worksheet.addRow({
                    numRef: offBridge.numRef,
                    createdAt: offBridge.creationDate,
                    incidentCause: offBridge.incidentCauses.name,
                    siteId: sites?.data.find(site=>site?.id === offBridge.siteId)?.name || offBridge.siteId,
                    tier: offBridge.tier,
                    container1: offBridge.container1,
                    container2: offBridge.container2,
                    plomb1: offBridge.plomb1,
                    plomb2: offBridge.plomb2,
                    loader: offBridge.loader,
                    product: offBridge.product,
                    transporter: offBridge.transporter,
                    vehicle: offBridge.vehicle,
                    blNumber: offBridge.blNumber,
                    driver: offBridge.driver,
                    trailer: offBridge.trailer,
                    description: offBridge.description,
                    createdBy: employees?.data.find(employee=>employee?.id === offBridge.createdBy)?.name || offBridge.createdBy,
                });
            });
    
    
            const filePath = path.join(exportsDir, `off-bridges_report.xlsx`);
            await workbook.xlsx.writeFile(filePath);
            const downloadLink = `${ADDRESS}/api/exports/incidents_report.xlsx`;
    
            res.status(HTTP_STATUS.OK.statusCode).json({ message: 'File created successfully', downloadLink });
            
        } catch (error) {
            console.log(error);
            res
            .sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
        }
    }
}
