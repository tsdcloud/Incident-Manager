import { Router } from "express";
import { createMovementController, deleteMovementController, getAllMovementsController, getMovementByIdController, updateMovementController } from "../controllers/movement.controller.js";
import { createMovementValidation, updateMovementValidation } from '../validations/movement.validation.js'
const routes = Router();

routes.get('/', getAllMovementsController);
routes.get('/:id', getMovementByIdController);
routes.post('/', createMovementValidation, createMovementController);
routes.patch('/:id', updateMovementValidation, updateMovementController);
routes.delete('/:id', deleteMovementController);


export default routes;