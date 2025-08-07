import { getQuickJS } from "quickjs-emscripten";

export const executeWithQuickJS = async (
  functionString: string,
  params: any,
  userSettings: any,
  functionName?: string
): Promise<any> => {
  const QuickJS = await getQuickJS();
  const vm = QuickJS.newContext();

  try {
    let execFunctionName = functionName;
    if (!execFunctionName) {
      const match = functionString.match(/function\s+(\w+)\s*\(/);
      if (!match) throw new Error("Could not extract function name");
      execFunctionName = match[1];
    }

    const consoleHandle = vm.newObject();
    const logFn = vm.newFunction("log", (...args: any[]) => {
      const dumpedArgs = args.map((arg) => vm.dump(arg));
      console.log("[Function]:", ...dumpedArgs);
    });
    vm.setProp(consoleHandle, "log", logFn);
    vm.setProp(vm.global, "console", consoleHandle);

    const nowFn = vm.newFunction("now", () => {
      return vm.newString(new Date().toISOString());
    });
    vm.setProp(vm.global, "now", nowFn);

    const defResult = vm.evalCode(functionString);
    if (defResult.error) {
      const error = vm.dump(defResult.error);
      defResult.error.dispose();
      throw new Error(`Function definition error: ${error}`);
    }
    defResult.value?.dispose();

    const executeCode = `${execFunctionName}(${JSON.stringify(
      params
    )}, ${JSON.stringify(userSettings)})`;
    const result = vm.evalCode(executeCode);

    if (result.error) {
      const error = vm.dump(result.error);
      result.error.dispose();
      throw new Error(`Execution error: ${error}`);
    }

    const output = vm.dump(result.value);
    result.value?.dispose();

    logFn.dispose();
    nowFn.dispose();
    consoleHandle.dispose();

    return output;
  } finally {
    vm.dispose();
  }
};
