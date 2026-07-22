import {Router} from 'express';
import { createReportingCgController, deleteReportingCgController, getAllReportingCgsController, updateReportingCgController, generateExcelReportingCgController } from '../controllers/reportingCg.controller.js';
import { createReportingCgValidation, updateReportingCgValidation } from '../validations/reportingCg.validation.js';

const routes = Router();

routes.get("/", getAllReportingCgsController);
routes.get("/export", generateExcelReportingCgController);
routes.post("/", createReportingCgValidation, createReportingCgController);
routes.patch("/:id", updateReportingCgValidation, updateReportingCgController);
routes.delete("/:id", deleteReportingCgController);

export default routes;