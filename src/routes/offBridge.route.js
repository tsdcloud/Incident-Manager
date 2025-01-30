import { Router } from "express";
import { 
    createOffBridgeController, 
    getAllOffBridgeController, 
    getOffBridgeByIdController, 
    updateOffBridgeController, 
    deleteOffBridgeController, 
    generateExcelFileController } from "../controllers/offBridge.controller.js";
import {
    createOffBridge,
    updateOffBridge
} from '../validations/offBridge.validations.js'
const routes = Router();

routes.get('/', getAllOffBridgeController);
routes.get('/file', generateExcelFileController);
routes.get('/:id', getOffBridgeByIdController);
routes.post('/', createOffBridge, createOffBridgeController);
routes.patch('/:id', updateOffBridge, updateOffBridgeController);
routes.delete('/:id', deleteOffBridgeController);


export default routes;