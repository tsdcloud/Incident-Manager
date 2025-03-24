import { Router } from "express";
import { createMaintenanceController, getAllMaintenanceController, getMaintenanceByIdController, updateMaintenanceController, generateExcelFileController, deleteMaintenanceController, closeMaintenanceController } from "../controllers/maintenance.controller.js";
import {
    closeMaintenance,
    createMaintenance,
    updateMaintenance
} from '../validations/maintenance.validation.js'
import { checkSupplierExist } from "../middlewares/entity.middleware.js";

const routes = Router();

routes.get('/', getAllMaintenanceController);
routes.get('/file', generateExcelFileController);
routes.get('/:id', getMaintenanceByIdController);
routes.post('/', createMaintenance, createMaintenanceController);
routes.patch('/:id', updateMaintenance, updateMaintenanceController);
routes.patch('/:id/close', closeMaintenance, checkSupplierExist, closeMaintenanceController);
routes.delete('/:id', deleteMaintenanceController);


export default routes;