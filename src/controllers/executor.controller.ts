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

    // Now you have access to authenticated user (added by middleware)
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

    // Optionally enhance userSettings with user info
    const enhancedUserSettings = {
      ...userSettings,
      executedBy: userId,
      executedByEmail: userEmail,
    };

    const result = await executeWithQuickJS(
      functionString,
      params,
      enhancedUserSettings, // or keep original userSettings if you don't want to modify
      functionName
    );

    res.json({
      success: true,
      result,
      executedBy: userEmail, // Optional: include who executed it
      executedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Execution failed";

    // Log error with user context
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
