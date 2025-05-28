import { Router } from "express";
import { createOperationController, deleteOperationController, getAllOperationController, getOperationByIdController, updateOperationController } from "../controllers/operations.controller.js";
import {
    createOperationValidation,
    updateOperationValidation
} from '../validations/operations.validation.js'
const routes = Router();

routes.get('/', getAllOperationController);
routes.get('/:id', getOperationByIdController);
routes.post('/', createOperationValidation, createOperationController);
routes.patch('/:id', updateOperationValidation, updateOperationController);
routes.delete('/:id', deleteOperationController);


export default routes;