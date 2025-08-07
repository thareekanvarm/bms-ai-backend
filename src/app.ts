import express, { Express } from "express";
import cors from "cors";
import executorRoutes from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/", executorRoutes);

export default app;
