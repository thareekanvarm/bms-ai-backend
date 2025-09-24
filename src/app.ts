import express, { Express } from "express";
import cors from "cors";
import { executeFunctionExpress } from "./controllers/executor.controller.express";
import { healthCheckExpress } from "./controllers/health.controller.express";
import { authenticateUserExpress } from "./middleware/auth.express";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Routes for local development (Express version)
app.get("/health", healthCheckExpress);
app.post("/execute", authenticateUserExpress, executeFunctionExpress);

export default app;
