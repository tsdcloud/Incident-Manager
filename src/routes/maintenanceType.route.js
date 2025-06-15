import { Router } from "express";
import { createMaintenanceTypeController, getAllMaintenanceTypeController, getMaintenanceTypeByIdController, updateMaintenanceTypeController, deleteMaintenanceTypeController } from "../controllers/maintenanceType.controller.js";
import {
    createMaintenanceTypeValidation,
    updateMaintenanceTypeValidation
} from '../validations/maintenanceType.validation.js'

const routes = Router();

routes.get('/', getAllMaintenanceTypeController);
routes.get('/:id', getMaintenanceTypeByIdController);
routes.post('/', createMaintenanceTypeValidation, createMaintenanceTypeController);
routes.patch('/:id', updateMaintenanceTypeValidation, updateMaintenanceTypeController);
routes.delete('/:id', deleteMaintenanceTypeController);


export default routes;