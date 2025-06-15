import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { PORT, prisma } from './config.js';
import HTTP_STATUS from './utils/http.utils.js';
import consommable from './routes/consommable.route.js'
import equipement from './routes/equipement.route.js'
import incident from './routes/incident.route.js'
import incidentCause from './routes/incidentCause.route.js'
import incidentType from './routes/incidentType.route.js'
import maintenance from './routes/maintenance.route.js'
import offBridge from './routes/offBridge.route.js'
import maintenanceType from './routes/maintenanceType.route.js'
import operationRoutes from './routes/operation.route.js'
import movementRoutes from './routes/movement.route.js'
import equipmentGroupRoutes from './routes/equipmentGroup.route.js';
import equipmentRoutes from './routes/equipement.route.js';
import { verifyUserExist } from './middlewares/verifyToken.middleware.js';
import {rateLimitAndTimeout} from './middlewares/ratelimiter.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { errorLogger } from './middlewares/errorHandlers.js';
import { logger } from './middlewares/logEvents.middleware.js';

import * as Sentry from "@sentry/node"



Sentry.init({
    dsn: process.env.SENTRY_DSN,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const  corsOptions = {
    origin: '*',
}
if(process.env.NODE_ENV != "development"){
    // app.use(Sentry.Handlers.requestHandler());
}

app.use(cors(corsOptions));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));
// app.use(rateLimitAndTimeout);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            


app.use(errorHandler);
app.use(logger);
// app.get("/debug-sentry", function mainHandler(req, res) { throw new Error("My first Sentry error!"); });
app.get("/api/exports/:file", (req, res)=>{
    try{
        const fileName = req.params.file;
        const filePath = path.join(__dirname, '..', 'exports', fileName);
        console.log(filePath)
    
        if (fs.existsSync(filePath)) {
            res.download(filePath, err => {
                if (err) {
                    console.error('File download error:', err);
                    res.status(HTTP_STATUS.BAD_REQUEST.statusCode).send('File download error.');
                }
            });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND.statusCode).send('File not found.');
        }
    }catch(error){
        console.log(error);
        res.sendStatus(HTTP_STATUS.BAD_REQUEST.statusCode)
    }
});

app.post('/api/v1/subscribe', async (req, res)=>{
    let {endpoint,
        expirationTime,
        keys} = req.body

    try {
        let subscriptions = await prisma.pushSubscription.create({
            data:{
                keys, expirationTime, endpoint
            }
        });
        res
        .status(HTTP_STATUS.CREATED.statusCode)
        .json({error:false, data:subscriptions})
    } catch (error) {
        console.log(error);
        res
        .status(HTTP_STATUS.BAD_REQUEST.statusCode)
        .send({error:true, error_list:[{
            message:`${error}`,
            field:'body'
        }]})
    }
});
app.use(verifyUserExist);
app.use("/api/incidents", incident);
app.use("/api/consommables", consommable);
app.use("/api/equipements", equipement);
app.use("/api/incident-causes", incidentCause);
app.use("/api/off-bridges", offBridge);
app.use("/api/incident-types", incidentType);
app.use("/api/maintenances", maintenance);
app.use("/api/maintenance-types", maintenanceType);
app.use("/api/operations", operationRoutes);
app.use("/api/movements", movementRoutes);
app.use("/api/equipment-groups", equipmentGroupRoutes);
app.use("/api/equipments", equipmentRoutes);


// app.get('/', (req, res)=>{
//     res
//     .status(HTTP_STATUS.OK.statusCode)
//     .json({repsonse: HTTP_STATUS.OK.message});
//     return;
// });



app.listen(PORT, ()=>console.log(`Server running on port ${PORT}...`))

