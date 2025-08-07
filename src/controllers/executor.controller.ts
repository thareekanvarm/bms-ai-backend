import { Request, Response } from "express";
import { executeWithQuickJS } from "../services/quickjs.service";

export const executeFunction = async (req: Request, res: Response) => {
  try {
    const {
      functionString,
      params = {},
      userSettings = {},
      functionName,
    } = req.body;
    if (!functionString) {
      return res.status(400).json({
        success: false,
        error: "functionString is required",
        executedAt: new Date().toISOString(),
      });
    }
    const result = await executeWithQuickJS(
      functionString,
      params,
      userSettings,
      functionName
    );
    res.json({
      success: true,
      result,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Execution failed";
    res.status(500).json({
      success: false,
      error: errorMessage,
      executedAt: new Date().toISOString(),
    });
  }
};
