import {Router} from 'express';
import { createShipController, deleteShipController, getAllShipsController, updateShipController } from '../controllers/ship.controller.js';
import { createShipValidation, updateShipValidation } from '../validations/ship.validation.js';

const routes = Router();

routes.get("/", getAllShipsController);
routes.post("/", createShipValidation, createShipController);
routes.patch("/:id", updateShipValidation, updateShipController);
routes.delete("/:id", deleteShipController);

export default routes;