import { Infobar } from "./infobar.js";
import { Taskbar } from "./taskbar.js";
import { Shell } from "./apps/shell.js";
import { Python } from "./apps/python.js";

export class OS {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.processes = [];
    this.root = null;
    this.infobar = new Infobar(this);
    this.taskbar = new Taskbar(this);
  }

  getVersion() {
    return this.version;
  }

  create() {
    this.root = document.getElementById("root");
    this.infobar.create(root);
    this.taskbar.create(root);
  }

  async addProcess(name, bind=null) {
    const pid = Math.floor(Math.random() * 10000);

    let process;
    switch (name) {
      case "python":
        process = new Python(this, name, pid, bind);
        break;
      case "shell":
        process = new Shell(this, name, pid, bind);
        break;
      default:
        console.log(`Unknown process: ${name}`);
        return null;
    }

    this.processes.push(process);
    const output = await process.create();

    if (output === false) {
        console.log(`Failed to create process: ${name}`);
        return null;
    }

    this.taskbar.addTask(process);

    console.log("Creating new process: ", name);
    this.infobar.refresh();
    return process;
  }

  removeProcess(pid) {
      const process = this.processes.find(p => p.getPID() === pid);
      this.processes.splice(this.processes.indexOf(process), 1);

      this.taskbar.removeTask(pid);

      console.log("Removing window: ", process.name);
      this.infobar.refresh();
  }
}