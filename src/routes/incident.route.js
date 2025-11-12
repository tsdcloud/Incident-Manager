import { Router } from "express";
import { createIncidentController, getAllIncidentController,
    getIncidentByIdController, updateIncidentController,
    deleteIncidentController, generateExcelFileController,
    getStatsController, reclassifyIncidentController,
    putIntoMaintenanceIncidentController
} from "../controllers/incident.controller.js";
import {
    createIncidentValidation,
    updateIncidentValidation
} from '../validations/incident.validation.js'
import { rateLimitAndTimeout } from "../middlewares/ratelimiter.middleware.js";
import { checkShiftExist, checkSiteExist } from "../middlewares/entity.middleware.js";
const routes = Router();

routes.get('/', getAllIncidentController);
routes.get('/stats', getStatsController);
routes.get('/file', generateExcelFileController);
routes.get('/:id', getIncidentByIdController);
routes.post('/', rateLimitAndTimeout, createIncidentValidation, checkSiteExist, checkShiftExist,createIncidentController);
routes.patch('/:id', rateLimitAndTimeout, updateIncidentValidation, checkSiteExist, checkShiftExist, updateIncidentController);
routes.patch('/put_into_maintenance/:id', rateLimitAndTimeout, updateIncidentValidation, putIntoMaintenanceIncidentController);
routes.patch('/reclassify/:id', rateLimitAndTimeout, updateIncidentValidation, reclassifyIncidentController);
routes.delete('/:id', rateLimitAndTimeout, deleteIncidentController);


export default routes;