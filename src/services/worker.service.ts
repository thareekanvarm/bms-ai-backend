import { Worker } from "worker_threads";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export const executeWithWorker = (
  functionString: string,
  params: any,
  userSettings: any,
  functionName?: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    let execFunctionName = functionName;
    if (!execFunctionName) {
      const match = functionString.match(/function\s+(\w+)\s*\(/);
      if (!match) {
        reject(new Error("Could not extract function name"));
        return;
      }
      execFunctionName = match[1];
    }

    console.log(`[Worker] Executing function: ${execFunctionName}`);
    console.log(`[Worker] Params:`, params);
    console.log(`[Worker] UserSettings:`, userSettings);

    // Create worker script with built-in fetch
    const workerScript = `
      const { parentPort } = require('worker_threads');
      
      // Safe console
      const console = {
        log: (...args) => {
          parentPort.postMessage({ type: 'log', data: args });
        },
        error: (...args) => {
          parentPort.postMessage({ type: 'error_log', data: args });
        },
        warn: (...args) => {
          parentPort.postMessage({ type: 'warn', data: args });
        }
      };
      
      // Global functions
      const now = () => new Date().toISOString();
      
      // Use built-in fetch (Node 18+)
      if (!global.fetch) {
        try {
          // Try to import fetch if available
          const { fetch: fetchImpl } = require('undici');
          global.fetch = fetchImpl;
        } catch (e) {
          // Fallback error
          global.fetch = () => {
            throw new Error('Fetch is not available. Please use Node.js 18+ or install undici');
          };
        }
      }
      
      // Error handling
      process.on('uncaughtException', (error) => {
        parentPort.postMessage({ type: 'error', data: error.message });
      });
      
      process.on('unhandledRejection', (reason) => {
        parentPort.postMessage({ type: 'error', data: reason.toString() });
      });
      
      async function executeFunction() {
        try {
          // Define the user function
          ${functionString}
          
          // Check if function exists
          if (typeof ${execFunctionName} !== 'function') {
            throw new Error('Function ${execFunctionName} is not defined');
          }
          
          // Prepare parameters
          const params = ${JSON.stringify(params)};
          const userSettings = ${JSON.stringify(userSettings)};
          
          console.log('About to execute function');
          
          // Execute the function
          const result = await ${execFunctionName}(params, userSettings);
          
          console.log('Function completed successfully');
          parentPort.postMessage({ type: 'result', data: result });
          
        } catch (error) {
          console.error('Function execution failed:', error.message);
          parentPort.postMessage({ type: 'error', data: error.message });
        }
      }
      
      // Start execution
      executeFunction();
    `;

    const tempFile = join(
      tmpdir(),
      `worker-${Date.now()}-${Math.random().toString(36).slice(2)}.js`
    );
    let worker: Worker | null = null;
    let isResolved = false;

    const cleanup = () => {
      if (worker) {
        worker.terminate();
        worker = null;
      }
      try {
        unlinkSync(tempFile);
      } catch (e) {}
    };

    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        reject(new Error("Function execution timeout (30 seconds)"));
      }
    }, 30000);

    try {
      writeFileSync(tempFile, workerScript);

      // Create worker with Node.js flags to enable fetch
      worker = new Worker(tempFile, {
        execArgv: ["--experimental-fetch"], // Enable fetch in older Node versions
      });

      worker.on("message", (message) => {
        if (isResolved) return;

        switch (message.type) {
          case "result":
            isResolved = true;
            clearTimeout(timeout);
            cleanup();
            console.log(`[Worker] Function completed successfully`);
            resolve(message.data);
            break;

          case "error":
            isResolved = true;
            clearTimeout(timeout);
            cleanup();
            console.error(`[Worker] Function execution failed:`, message.data);
            reject(new Error(message.data));
            break;

          case "log":
            console.log("[Function]:", ...message.data);
            break;

          case "error_log":
            console.error("[Function Error]:", ...message.data);
            break;

          case "warn":
            console.warn("[Function Warning]:", ...message.data);
            break;
        }
      });

      worker.on("error", (error) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timeout);
          cleanup();
          console.error(`[Worker] Worker error:`, error);
          reject(error);
        }
      });

      worker.on("exit", (code) => {
        if (!isResolved && code !== 0) {
          isResolved = true;
          clearTimeout(timeout);
          cleanup();
          console.error(`[Worker] Worker exited with code ${code}`);
          reject(new Error(`Worker exited with code ${code}`));
        }
      });
    } catch (error) {
      clearTimeout(timeout);
      cleanup();
      reject(error);
    }
  });
};
