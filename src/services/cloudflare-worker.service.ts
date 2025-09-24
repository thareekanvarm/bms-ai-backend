import { executeWithQuickJS } from "./quickjs.service";

export const executeWithCloudflareWorker = async (
  functionString: string,
  params: any,
  userSettings: any,
  functionName?: string
): Promise<any> => {
  try {
    console.log(`[Cloudflare Worker] Executing function: ${functionName || 'anonymous'}`);
    console.log(`[Cloudflare Worker] Params:`, params);
    console.log(`[Cloudflare Worker] UserSettings:`, userSettings);

    // Use QuickJS for function execution in Cloudflare Workers
    const result = await executeWithQuickJS(
      functionString,
      params,
      userSettings,
      functionName
    );

    console.log(`[Cloudflare Worker] Function completed successfully`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Execution failed";
    console.error(`[Cloudflare Worker] Function execution failed:`, errorMessage);
    throw new Error(errorMessage);
  }
};

