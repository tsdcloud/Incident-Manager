import { Router } from "express";
import { createMaintenanceController, getAllMaintenanceController, getMaintenanceByIdController, updateMaintenanceController, deleteMaintenanceController } from "../controllers/maintenance.controller.js";
import {
    createMaintenance,
    updateMaintenance
} from '../validations/maintenance.validation.js'

const routes = Router();

routes.get('/', getAllMaintenanceController);
routes.get('/:id', getMaintenanceByIdController);
routes.post('/', createMaintenance, createMaintenanceController);
routes.patch('/:id', updateMaintenance, updateMaintenanceController);
routes.delete('/:id', deleteMaintenanceController);


export default routes;