import { Context } from "hono";

export const healthCheck = (c: Context): Response => {
  return c.json({
    success: true,
    message: "Function executor running with QuickJS",
    timestamp: new Date().toISOString(),
  });
};
