import { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Function executor running with QuickJS",
    timestamp: new Date().toISOString(),
  });
};
