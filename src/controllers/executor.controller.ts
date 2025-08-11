import { Request, Response } from "express";
import { executeWithWorker } from "../services/worker.service";

export const executeFunction = async (req: Request, res: Response) => {
  try {
    const {
      functionString,
      params = {},
      userSettings = {},
      functionName,
    } = req.body;

    const userId = req.user?.id;
    const userEmail = req.user?.email;

    console.log(
      `Function execution requested by user: ${userEmail} (${userId})`
    );

    if (!functionString) {
      return res.status(400).json({
        success: false,
        error: "functionString is required",
        executedAt: new Date().toISOString(),
      });
    }

    // Enhanced userSettings with user info
    const enhancedUserSettings = {
      ...userSettings,
      executedBy: userId,
      executedByEmail: userEmail,
    };

    const result = await executeWithWorker(
      functionString,
      params,
      enhancedUserSettings,
      functionName
    );

    res.json({
      success: true,
      result,
      executedBy: userEmail,
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Execution failed";

    console.error(
      `Function execution error for user ${req.user?.email}:`,
      errorMessage
    );

    res.status(500).json({
      success: false,
      error: errorMessage,
      executedAt: new Date().toISOString(),
    });
  }
};
