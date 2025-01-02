import { Router } from "express";
import { createConsommableController, deleteConsommableController, getAllConsommableController, getConsommableByIdController, updateConsommableController } from "../controllers/consommable.controller.js";
import {
    createConsommable,
    updateConsommable
} from '../validations/consomable.validation.js'
const routes = Router();

routes.get('/', getAllConsommableController);
routes.get('/:id', getConsommableByIdController);
routes.post('/', createConsommable, createConsommableController);
routes.patch('/:id', updateConsommable, updateConsommableController);
routes.delete('/:id', deleteConsommableController);


export default routes;