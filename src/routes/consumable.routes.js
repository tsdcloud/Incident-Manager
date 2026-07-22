import {Router} from 'express';
import { createConsumableController, deleteConsumableController, getAllConsumablesController, updateConsumableController } from '../controllers/consumable.controller.js';
import { createConsumableValidation, updateConsumableValidation } from '../validations/consumable.validator.js';

const routes = Router();

routes.get("/", getAllConsumablesController);
routes.post("/", createConsumableValidation, createConsumableController);
routes.patch("/:id", updateConsumableValidation, updateConsumableController);
routes.delete("/:id", deleteConsumableController);

export default routes;