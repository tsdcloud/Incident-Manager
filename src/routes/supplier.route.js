import { Router } from "express";
import { createSupplierController, getAllSuppliersController, getSupplierByIdController, updateSupplierController, deleteSupplierController } from "../controllers/supplier.controller.js";
import { 
    createSupplier,
    updateSupplier
 } from '../validations/supplier.validation.js';

const routes = Router();

routes.get('/', getAllSuppliersController);
routes.get('/:id', getSupplierByIdController);
routes.post('/', createSupplier, createSupplierController);
routes.patch('/:id', updateSupplier, updateSupplierController);
routes.delete('/:id', deleteSupplierController);


export default routes;