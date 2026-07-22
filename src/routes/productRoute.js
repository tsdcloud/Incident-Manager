import {Router} from 'express';
import { createProductController, deleteProductController, getAllProductsController, updateProductController } from '../controllers/product.controller.js';
import { createProductValidation, updateProductValidation } from '../validations/product.validation.js';

const routes = Router();

routes.get("/", getAllProductsController);
routes.post("/", createProductValidation, createProductController);
routes.patch("/:id", updateProductValidation, updateProductController);
routes.delete("/:id", deleteProductController);

export default routes;