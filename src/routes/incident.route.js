import { Router } from "express";
import { createIncidentController, getAllIncidentController, getIncidentByIdController, updateIncidentController, deleteIncidentController, generateExcelFileController } from "../controllers/incident.controller.js";
import {
    createIncident,
    updateIncident
} from '../validations/incident.validation.js'
import { rateLimitAndTimeout } from "../middlewares/ratelimiter.middleware.js";
import { checkShiftExist, checkSiteExist } from "../middlewares/entity.middleware.js";
const routes = Router();

routes.get('/', getAllIncidentController);
routes.get('/file', generateExcelFileController);
routes.get('/:id', getIncidentByIdController);
routes.post('/', rateLimitAndTimeout, createIncident, checkSiteExist, checkShiftExist,createIncidentController);
routes.patch('/:id', rateLimitAndTimeout, updateIncident, checkSiteExist, checkShiftExist, updateIncidentController);
routes.delete('/:id', rateLimitAndTimeout, deleteIncidentController);


export default routes;