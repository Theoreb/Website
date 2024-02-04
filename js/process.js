import { CWindow } from "./win.js";

export class Process {
    constructor(os, name, pid, bind = null) {
        this.os = os;
        this.bind = bind;
        this.name = name;
        this.pid = pid;
        this.window = null;
    }

    createWindow() {
        this.window = new CWindow(this);
        this.window.create();
    }

    destroyWindow() {
        if (this.window) {
            this.window.destroy();
            this.window = null;
        }
    }

    getProcessName() {
        return this.name;
    }

    getPID() {
        return this.pid;
    }

    getWindow() {
        return this.window;
    }

    setWindowVisibility(visibility) {
        if (this.window) {
            this.window.setVisibility(visibility);
        }
    }

    create() {
        this.createWindow();
    }

    setName(name) {
        this.name = name;
        if (this.window) {
            this.window.updateName(name);
        }
    }

    quit() {
        this.os.removeProcess(this.pid);
        this.destroyWindow();
    }
}