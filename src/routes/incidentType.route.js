import { Router } from "express";
import { createIncidentTypeController, getAllIncidentTypeController, getIncidentTypeByIdController, updateIncidentTypeController, deleteIncidentTypeController } from "../controllers/incidentType.controller.js";
import {
    createIncidentType,
    updateIncidentType
} from '../validations/incidentType.validation.js'


const routes = Router();

routes.get('/', getAllIncidentTypeController);
routes.get('/:id', getIncidentTypeByIdController);
routes.post('/', createIncidentType, createIncidentTypeController);
routes.patch('/:id', updateIncidentType, updateIncidentTypeController);
routes.delete('/:id', deleteIncidentTypeController);


export default routes;