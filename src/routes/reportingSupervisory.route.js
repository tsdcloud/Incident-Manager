
import {Router} from 'express';
import { createReportingSupervisoryController, deleteReportingSupervisoryController, getAllReportingSupervisorysController, updateReportingSupervisoryController, generateExcelReportingSupervisoryController } from '../controllers/reportingSupervisory.controller.js';
import { createReportingSupervisoryValidation, updateReportingSupervisoryValidation } from '../validations/reportingSupervisory.validator.js';

const routes = Router();

routes.get("/", getAllReportingSupervisorysController);
routes.get("/export", generateExcelReportingSupervisoryController);
routes.post("/", createReportingSupervisoryValidation, createReportingSupervisoryController);
routes.patch("/:id", updateReportingSupervisoryValidation, updateReportingSupervisoryController);
routes.delete("/:id", deleteReportingSupervisoryController);

export default routes;