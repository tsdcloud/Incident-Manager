import { Router } from "express";
import { createEquipementController, deleteEquipementController, getAllEquipementController, getEquipementByIdController, updateEquipementController } from "../controllers/equipement.controller.js";
import {
    createEquipement,
    updateEquipement
} from '../validations/equipement.validation.js'
const routes = Router();

routes.get('/', getAllEquipementController);
routes.get('/:id', getEquipementByIdController);
routes.post('/', createEquipement,createEquipementController);
routes.patch('/:id', updateEquipement, updateEquipementController);
routes.delete('/:id', deleteEquipementController);


export default routes;