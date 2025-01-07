import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors'
import helmet from 'helmet'
import { PORT } from './config.js';
import HTTP_STATUS from './utils/http.utils.js';
import consommable from './routes/consommable.route.js'
import equipement from './routes/equipement.route.js'
import incident from './routes/incident.route.js'
import incidentCause from './routes/incidentCause.route.js'
import incidentType from './routes/incidentType.route.js'
import maintenance from './routes/maintenance.route.js'
import maintenanceType from './routes/maintenanceType.route.js'
import supplier from './routes/supplier.route.js'

const app = express();
app.use(cors());
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(bodyParser.json());

// app.use("*", (req, res, next) =>{
//     console.log(req.path, "--", req.method);
//     next();
// })

app.use("/api/consommables", consommable);
app.use("/api/equipements", equipement);
app.use("/api/incidents", incident);
app.use("/api/incident-causes", incidentCause);
app.use("/api/incident-types", incidentType);
app.use("/api/maintenances", maintenance);
app.use("/api/maintenance-types", maintenanceType);
app.use("/api/suppliers", supplier);

// app.get('/', (req, res)=>{
//     res
//     .status(HTTP_STATUS.OK.statusCode)
//     .json({repsonse: HTTP_STATUS.OK.message});
//     return;
// });



app.listen(PORT, ()=>console.log(`Server running on port ${PORT}...`))

