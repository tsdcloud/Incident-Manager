import { Router } from 'express';
import {
    createWatchReportController,
    deleteWatchReportController,
    getAllWatchReportsController,
    updateWatchReportController,
    generateExcelWatchReportController,
    exportPdfWatchReportController
} from '../controllers/watchReport.controller.js';
import {
    createWatchReportValidation,
    updateWatchReportValidation
} from '../validations/watchReport .validation.js';

const routes = Router();

routes.get("/", getAllWatchReportsController);
routes.get("/export", generateExcelWatchReportController);
routes.post("/", createWatchReportValidation, createWatchReportController);
routes.patch("/:id", updateWatchReportValidation, updateWatchReportController);
routes.delete("/:id", deleteWatchReportController);
routes.get("/:id/pdf", exportPdfWatchReportController);

export default routes;