import { Request, Response } from "express";

export const healthCheckExpress = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Function executor running with QuickJS",
    timestamp: new Date().toISOString(),
  });
};

