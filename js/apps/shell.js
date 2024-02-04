import { Process } from "../process.js";

export class Shell extends Process {
    constructor(os, name, pid, bind = null) {
        super(os, name, pid, bind);
        this.display = null;
        this.inputLine = null;
        this.subprocess = null;
        this.lastKey = null;
        this.prefix = "~$ ";
        this.initializeShell();
    }

    async initializeShell() {
        console.log("Shell initialized.");
        // Placeholder for any required shell initialization logic
    }

    create() {
        super.create();
        this.display = this.window.getDisplay();
        this.display.classList.add("Console");
        this.display.contentEditable = "true";
        this.appendOutput("Welcome to the shell. Type 'help' for a list of commands.\n", false);
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.display.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.display.addEventListener('click', () => this.focusInputLine());
    }

    focusInputLine() {
        focusElement(this.inputLine);
    }

    async handleKeyDown(event) {
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
        } else if (this.lastKey == "Control" && event.key == "c") {
            event.preventDefault();
            if (this.subprocess) {
                this.subprocess.quit();
            } else {
                this.appendOutput("Exited shell.", true);
                this.quit();
            }
        }

        if (event.key == 'ArrowUp' && this.display.childElementCount > 2) {
            const oldElement = this.display.children[this.display.childElementCount - 3];
            this.inputLine.innerText = oldElement.innerText;
            this.focusInputLine();
    
        } else if (event.key === 'Backspace' && this.inputLine.innerText == this.prefix) {
            event.preventDefault();
        } else if (event.key === 'Enter') {
            event.preventDefault();
            const command = this.extractCommand();
            if (command) await this.process(command);
        }

        this.lastKey = event.key;
    }

    extractCommand() {
        let command = this.inputLine.innerText.trim();
        command = command.replace(this.prefix, '');
        this.inputLine.contentEditable = "false";
        return command;
    }

    async process(command) {
        console.log("Running command:", command);

        if (this.subprocess) {
            const output = await this.subprocess.run(command);
            this.appendOutput(output[0], output[1]);
            return;
        }

        if (command.startsWith('new')) {
            if (command.length < 4) {
                this.appendOutput("Usage: new 'process_name'", true);
            } else {
                this.createNewProcess(command.substring(4));
            }
            return;
        }

        switch (command) {
            case 'python':
                const output = await this.bindProcess('python');
                if (output == true) {
                    this.prefix = ">>> ";
                    this.createNewInputLine();
                }
                break;
            case 'exit':
                this.quit();
                break;
            case 'clear':
                this.clearDisplay();
                break;
            case 'help':
                this.showHelp();
                break;
            default:
                this.appendOutput(`Command not found: ${command}`, true);
        }
    }

    async createNewProcess(processName) {
        const process = await this.os.addProcess(processName);
        if (process) {
            this.appendOutput(`Started new process: ${processName} (PID: ${process.getPID()})`, false);
        } else {
            this.appendOutput(`Process not found: ${processName}`, true);
        }
    }

    async bindProcess(processName) {
        try {
            const subprocess = await this.os.addProcess(processName, this);
            if (subprocess) {
                this.subprocess = subprocess;
                this.writeConsole(`Started subprocess: ${processName} (PID: ${subprocess.getPID()})`, false);
                this.setName(`shell (${processName})`);
                return true;
            } else {
                this.appendOutput(`Error starting subprocess: ${processName}.`, true);
            }
        } catch (error) {
            this.appendOutput(`Failed to start subprocess: ${processName}. Error: ${error.message}`, true);
        }
        return false;
    }

    unbindProcess() {
        this.setName("shell");
        this.subprocess = null;
        this.prefix = "~$ ";
        this.createNewInputLine();
    }
    

    clearDisplay() {
        this.display.innerHTML = '';
        this.createNewInputLine();
    }

    showHelp() {
        this.appendOutput("Available commands: 'help', 'clear', 'exit', 'python', 'new [process_name]'", false);
    }

    appendOutput(text, isError) {
        this.writeConsole(text, isError);
        this.createNewInputLine();
    }

    writeConsole(text, isError) {
        const output = document.createElement("div");
        output.innerHTML = isError ? `<span style="color: red;">${text}</span>` : `<span>${text}</span>`;
        this.display.appendChild(output);
    }

    createNewInputLine() {
        this.inputLine = document.createElement("div");
        this.inputLine.innerHTML = this.prefix;
        this.inputLine.contentEditable = "true";
        this.display.appendChild(this.inputLine);
        this.display.scrollTop = this.display.scrollHeight;
        this.inputLine.scrollIntoView();

        focusElement(this.inputLine);
    }

    quit() {
        if (this.subprocess) {
            this.os.removeProcess(this.subprocess.getPID());
            this.appendOutput(`Terminated subprocess: ${this.subprocess.name} (PID: ${this.subprocess.getPID()})`, false);
            this.subprocess = null;
        }
        super.quit();
    }
    
}

function focusElement(element) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
}
