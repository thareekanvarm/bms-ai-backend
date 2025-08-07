import { SafeEnvironment } from "./types";

export function createSafeEnvironment(): SafeEnvironment {
  return {
    console: {
      log: (...args: any[]) => console.log("[Function]:", ...args),
      error: (...args: any[]) => console.error("[Function]:", ...args),
      warn: (...args: any[]) => console.warn("[Function]:", ...args),
    },
    now: () => new Date().toISOString(),
    Date: Date,
    JSON: JSON,
    Math: Math,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
  };
}

export function extractFunctionName(functionString: string): string | null {
  const match = functionString.match(/function\s+(\w+)\s*\(/);
  return match ? match[1] : null;
}

export function validateExecutionRequest(req: any): {
  isValid: boolean;
  error?: string;
} {
  if (!req.functionString || typeof req.functionString !== "string") {
    return {
      isValid: false,
      error: "functionString is required and must be a string",
    };
  }

  if (req.params && typeof req.params !== "object") {
    return { isValid: false, error: "params must be an object" };
  }

  if (req.userSettings && typeof req.userSettings !== "object") {
    return { isValid: false, error: "userSettings must be an object" };
  }

  return { isValid: true };
}
