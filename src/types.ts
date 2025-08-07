export interface ExecutionRequest {
  functionString: string;
  params?: Record<string, any>;
  userSettings?: Record<string, any>;
  functionName?: string;
}

export interface ExecutionResponse {
  success: boolean;
  result?: any;
  error?: string;
  executedAt: string;
}

export interface SafeEnvironment {
  console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  };
  now: () => string;
  Date: DateConstructor;
  JSON: JSON;
  Math: Math;
  parseInt: typeof parseInt;
  parseFloat: typeof parseFloat;
  isNaN: typeof isNaN;
  isFinite: typeof isFinite;
  setTimeout: any;
  clearTimeout: any;
}
