import express from "express";
const fileRoutes = express.Router();
import upload from '../middlewares/upload.js';

import { uploadFile, toExcel, download, uploadFiles } from "../controllers/fileController.js";

fileRoutes.post("/export-to-excel", toExcel);
fileRoutes.post("/upload", upload.array('files', 10), uploadFile);
fileRoutes.get("/download/:filename", download);
fileRoutes.post('/uploads', upload.array('files', 10), uploadFiles);

export { fileRoutes };