import express from "express";
import { alumniRouter } from "./routes/alumni.routes.js";
import { companyRouter } from "./routes/company.routes.js";
import { resourceRouter } from "./routes/resource.routes.js";
import { statisticsRouter } from "./routes/statistics.routes.js";


const app = express();

const basePath = "/api/v1/cdpc";

app.use(basePath + "/alumni", alumniRouter);
app.use(basePath + "/company", companyRouter);
app.use(basePath + "/resource", resourceRouter);
app.use(basePath + "/statistics", statisticsRouter);

export { app };
