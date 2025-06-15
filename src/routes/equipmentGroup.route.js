import {Router} from 'express';
import { createEquipmentGroupController, deleteEquipeGroupController, getAllEquipmentGroupsController, updateEquipmentGroupController } from '../controllers/equipmentGroup.controller.js';
import { createEquipmentGroupValidation, updateEquipmentGroupValidation } from '../validations/equipmentGroup.validation.js';

const routes = Router();

routes.get("/", getAllEquipmentGroupsController);
routes.post("/", createEquipmentGroupValidation, createEquipmentGroupController);
routes.patch("/:id", updateEquipmentGroupValidation, updateEquipmentGroupController);
routes.delete("/:id", deleteEquipeGroupController);

export default routes;