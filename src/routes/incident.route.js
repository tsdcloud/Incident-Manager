import { Router } from "express";
import { createIncidentController, getAllIncidentController, getIncidentByIdController, updateIncidentController, deleteIncidentController, generateExcelFileController } from "../controllers/incident.controller.js";
import {
    createIncident,
    updateIncident
} from '../validations/incident.validation.js'
const routes = Router();

routes.get('/', getAllIncidentController);
routes.get('/file', generateExcelFileController);
routes.get('/:id', getIncidentByIdController);
routes.post('/', createIncident, createIncidentController);
routes.patch('/:id', updateIncident, updateIncidentController);
routes.delete('/:id', deleteIncidentController);


export default routes;