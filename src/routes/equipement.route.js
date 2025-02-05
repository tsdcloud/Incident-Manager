import { Router } from "express";
import { createEquipementController, deleteEquipementController, getAllEquipementController, getEquipementByIdController, updateEquipementController, uploadEquipementController } from "../controllers/equipement.controller.js";
import {
    createEquipement,
    updateEquipement
} from '../validations/equipement.validation.js'
import multer from 'multer';


const upload = multer({ dest: "uploads/" });
const routes = Router();

routes.get('/', getAllEquipementController);
routes.get('/:id', getEquipementByIdController);
routes.post('/', createEquipement,createEquipementController);
routes.post('/upload', upload.single('file'),uploadEquipementController);
routes.patch('/:id', updateEquipement, updateEquipementController);
routes.delete('/:id', deleteEquipementController);


export default routes;