import { Router } from "express";
import { executeFunction } from "../controllers/executor.controller";
import { healthCheck } from "../controllers/health.controller";

const router: Router = Router();

router.post("/execute", executeFunction);
router.get("/health", healthCheck);

export default router;
