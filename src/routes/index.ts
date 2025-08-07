import { Router } from "express";
import { executeFunction } from "../controllers/executor.controller";
import { healthCheck } from "../controllers/health.controller";
import { authenticateUser } from "../middleware/auth";

const router: Router = Router();

router.get("/health", healthCheck);
router.post("/execute", authenticateUser, executeFunction);

export default router;
