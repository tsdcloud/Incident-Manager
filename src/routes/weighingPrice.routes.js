import {Router} from 'express';
import { createWeighingPriceController, deleteWeighingPriceController, getAllWeighingPricesController, updateWeighingPriceController } from '../controllers/weighingPrice.controller.js';
import { createWeighingPriceValidation, updateWeighingPriceValidation } from '../validations/weighingPrice.validator.js';

const routes = Router();

routes.get("/", getAllWeighingPricesController);
routes.post("/", createWeighingPriceValidation, createWeighingPriceController);
routes.patch("/:id", updateWeighingPriceValidation, updateWeighingPriceController);
routes.delete("/:id", deleteWeighingPriceController);

export default routes;