import { Router } from "express";
import { createEquipementController, deleteEquipementController, getAllEquipementController, getEquipementByIdController, getEquipementHistoryController, getSiteEquipmentsController, updateEquipementController, uploadEquipementController } from "../controllers/equipement.controller.js";
import {
    createEquipementValidation,
    updateEquipementValidation
} from '../validations/equipement.validation.js'
import multer from 'multer';


const upload = multer({ dest: "uploads/" });
const routes = Router();

routes.get('/', getAllEquipementController);
routes.get('/site/:siteId', getSiteEquipmentsController);
routes.get('/:id', getEquipementByIdController);
routes.get('/:id/:siteId', getEquipementHistoryController);
routes.post('/', createEquipementValidation, createEquipementController);
routes.post('/upload', upload.single('file'),uploadEquipementController);
routes.patch('/:id', updateEquipementValidation, updateEquipementController);
routes.delete('/:id', deleteEquipementController);


export default routes;