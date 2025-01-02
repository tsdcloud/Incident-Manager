import { Router } from "express";
import { createMaintenanceTypeController, getAllMaintenanceTypeController, getMaintenanceTypeByIdController, updateMaintenanceTypeController, deleteMaintenanceTypeController } from "../controllers/maintenanceType.controller.js";
import {
    createMaintenanceType,
    updateMaintenanceType
} from '../validations/maintenanceType.validation.js'

const routes = Router();

routes.get('/', getAllMaintenanceTypeController);
routes.get('/:id', getMaintenanceTypeByIdController);
routes.post('/', createMaintenanceType, createMaintenanceTypeController);
routes.patch('/:id', updateMaintenanceType, updateMaintenanceTypeController);
routes.delete('/:id', deleteMaintenanceTypeController);


export default routes;