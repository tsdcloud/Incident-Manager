import {Router} from 'express';
import { createEquipmentGroupFamilyController, deleteEquipementGroupFamilyController, getAllEquipmentGroupFamiliesController, updateEquipmentGrupFamilyController } from '../controllers/equipmentGroupFamily.controller.js';
import { createEquipmentGroupFamilyValidation, updateEquipmentGroupFamilyValidation } from '../validations/equipmentGroupFamily.validation.js';

const routes = Router();

routes.get("/", getAllEquipmentGroupFamiliesController);
routes.post("/", createEquipmentGroupFamilyValidation, createEquipmentGroupFamilyController);
routes.patch("/:id", updateEquipmentGroupFamilyValidation, updateEquipmentGrupFamilyController);
routes.delete("/:id", deleteEquipementGroupFamilyController);

export default routes;