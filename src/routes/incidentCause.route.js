import { Router } from "express";
import { createIncidentCauseController, getAllIncidentCauseController, getIncidentCauseByIdController, updateIncidentCauseController, deleteIncidentCauseController } from "../controllers/incidentCause.controller.js";
import {
    createIncidentCause,
    updateIncidentCause
} from '../validations/incidentCause.validation.js';


const routes = Router();

routes.get('/', getAllIncidentCauseController);
routes.get('/:id', getIncidentCauseByIdController);
routes.post('/', createIncidentCause, createIncidentCauseController);
routes.patch('/:id', updateIncidentCause, updateIncidentCauseController);
routes.delete('/:id', deleteIncidentCauseController);


export default routes;