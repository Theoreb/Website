class App {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.windows = [];
    this.root = null;
  }

  getAppVersion() {
    return this.version;
  }

  initialize() {
    this.root = document.getElementById("root");
    console.log("App initialized: " + this.name + " v" + this.getAppVersion());
  }

  addWindow(name) {
    win = new Window(name)
    win.create(this.root);
    this.windows.push(win);
  }
}