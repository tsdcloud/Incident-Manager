import {Router} from 'express';
import { createEquipmentGroupController, deleteEquipmentGroupController , getAllEquipmentGroupsController, updateEquipmentGroupController } from '../controllers/equipmentGroup.controller.js';
import { createEquipmentGroupValidation, updateEquipmentGroupValidation } from '../validations/equipmentGroup.validation.js';

const routes = Router();

routes.get("/", getAllEquipmentGroupsController);
routes.post("/", createEquipmentGroupValidation, createEquipmentGroupController);
routes.patch("/:id", updateEquipmentGroupValidation, updateEquipmentGroupController);
routes.delete("/:id", deleteEquipmentGroupController );

export default routes;