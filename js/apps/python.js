import { Process } from "../process.js";

async function createPyodideWorker() {
    window.pyodide = await loadPyodide();
    await window.pyodide.loadPackage(['micropip', 'matplotlib']);
}

export class Python extends Process {
    constructor(os, name, pid, bind = null) {
        super(os, name, pid, bind);
        this.pythonVersion = null;
    }

    async initializePyodide() {
        try {
            if (window.pyodide === undefined) {
                await createPyodideWorker();
            }

            await this.definePythonFunctions();

            this.pythonVersion = window.pyodide.runPython(`
                    import sys
                    sys.version
            `);
            console.log(`Python version: ${this.pythonVersion}`);
            return true;
        } catch (error) {
            console.error("Error initializing Pyodide:", error);
            return false;
        }
    }

    async definePythonFunctions() {
        await window.pyodide.runPythonAsync(`
            import contextlib
            import io

            def run_and_capture(code):
                output_capture = io.StringIO()
                with contextlib.redirect_stdout(output_capture), contextlib.redirect_stderr(output_capture):
                    try:
                        result = eval(code, globals())
                        if result is not None:
                            print(result)
                    except SyntaxError:
                        exec(code, globals())
                return output_capture.getvalue()
        `);
    }

    create() {
        return this.initializePyodide();
    }

    async run(command) { 
        console.log("Running command:", command);

        try {
            const pythonCommandString = `run_and_capture("""${command}""")`;
            return [await window.pyodide.runPythonAsync(pythonCommandString), false];
        } catch (error) {
            return [`JSError: ${error.message}`, true];
        }
    }

    quit() {
        this.os.removeProcess(this.pid);
        this.bind.unbindProcess(this);
    }
}
