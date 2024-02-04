export class CWindow {
  constructor(process) {
    this.process = process;
    this.element = document.createElement("div");
    this.element.className = "CWindow";
    this.toolbar = new Toolbar(this);
    this.isVisible = true;
    this.zIndex = 1; // Default zIndex

    this.resizeDirection = null;
    this.fullScreen = false;
    this.isResizing = false;

    this.display = document.createElement("div");
    this.display.className = "Display";

    this.element.addEventListener("mousedown", (e) => this.startResizing(e));
    document.addEventListener("mousemove", (e) => this.resizeWindow(e));
    document.addEventListener("mouseup", () => this.stopResizing());
  }

  updateAttributes(top, left, width, height) {
    Object.assign(this.element.style, { top, left, width, height });
  }

  getDisplay() {
    return this.display;
  }

  create() {
    this.updateAttributes("calc(50% - 200px)", "calc(50% - 200px)", "200px", "200px");
    root.appendChild(this.element);
    this.element.appendChild(this.display);
    this.toolbar.create();
  }

  destroy() {
    this.element.style.transition = "all 0.3s ease";
    this.element.style.opacity = "0";
    setTimeout(() => this.element.remove(), 300);
  }

  startResizing(event) {
    if (this.fullScreen) return;
    const bounds = this.element.getBoundingClientRect();
    const BORDER_SIZE = 10;
    this.resizeDirection = '';

    if (event.clientX - bounds.left <= BORDER_SIZE) this.resizeDirection += 'left';
    else if (bounds.right - event.clientX <= BORDER_SIZE) this.resizeDirection += 'right';
    if (event.clientY - bounds.top <= BORDER_SIZE) this.resizeDirection += 'top';
    else if (bounds.bottom - event.clientY <= BORDER_SIZE) this.resizeDirection += 'bottom';

    if (this.resizeDirection) {
      this.isResizing = true;
      document.body.style.cursor = this.getCursorStyle();
      event.preventDefault();
    }
  }

  resizeWindow(event) {
    if (!this.isResizing) return;
    const MIN_SIZE = 80;
    const INFOBAR_HEIGHT = 30;
    const bounds = this.element.getBoundingClientRect();

    let newLeft = bounds.left, newTop = bounds.top;
    let newWidth = bounds.width, newHeight = bounds.height;

    if (this.resizeDirection.includes('left')) {
      newLeft = Math.max(Math.min(event.clientX, bounds.right - MIN_SIZE), 0);
      newWidth = bounds.right - newLeft;
    } else if (this.resizeDirection.includes('right')) {
      newWidth = Math.min(Math.max(event.clientX - bounds.left, MIN_SIZE), window.innerWidth - newLeft);
    }

    if (this.resizeDirection.includes('top')) {
      newTop = Math.max(Math.min(event.clientY, bounds.bottom - MIN_SIZE), INFOBAR_HEIGHT);
      newHeight = bounds.bottom - newTop;
    } else if (this.resizeDirection.includes('bottom')) {
      newHeight = Math.min(Math.max(event.clientY - bounds.top, MIN_SIZE), window.innerHeight - newTop);
    }

    this.updateAttributes(newTop + 'px', newLeft + 'px', newWidth + 'px', newHeight + 'px');
    document.body.style.cursor = this.getCursorStyle();
  }

  getCursorStyle() {
    const directionToCursor = {
      'left': 'ew-resize', 'right': 'ew-resize',
      'top': 'ns-resize', 'bottom': 'ns-resize',
      'lefttop': 'nwse-resize', 'righttop': 'nesw-resize',
      'leftbottom': 'nesw-resize', 'rightbottom': 'nwse-resize'
    };
    return directionToCursor[this.resizeDirection.replace('-', '')] || 'default';
  }

  stopResizing() {
    this.isResizing = false;
    document.body.style.cursor = "default";
  }

  focus() {
    // Calculate the max zIndex from all processes
    const values = this.process.os.processes.map(el => {
      return el.window && el.window.zIndex ? parseInt(el.window.zIndex, 10) : 0;
    });
    const maxValue = Math.max(0, ...values); // Ensure at least 0 if values is empty
    this.zIndex = maxValue + 1;
    this.element.style.zIndex = this.zIndex.toString();
  }

  setVisibility(visibility) {
    this.element.style.transition = "all 0.3s ease";

    if (visibility && !this.isVisible) {
        this.makeVisible();
    } else if (!visibility && this.isVisible) {
        this.makeInvisible();
    }
  }

  makeVisible() {
      this.focus();

      this.element.style.visibility = "visible";
      this.element.style.opacity = "1";
      this.isVisible = true;

      setTimeout(() => {
          this.element.style.transition = "";
      }, 300);
  }

  makeInvisible() {
      this.element.style.opacity = "0";
      this.isVisible = false;

      setTimeout(() => {
          this.element.style.visibility = "hidden";
          this.element.style.transition = "";
      }, 300);
  }


  updateName(name) {
    this.name = name;
    this.toolbar.updateName(name);
  }
}

class Toolbar {
  constructor(win) {
    this.win = win;
    this.title = document.createElement("div");
    this.title.className = "ToolbarTitle";
    this.element = document.createElement("div");
    this.element.className = "Toolbar";
    this.buttons = [];

    this.element.addEventListener("mousedown", (e) => this.startDragging(e));
    document.addEventListener("mouseup", () => this.stopDragging());
    document.addEventListener("mousemove", (e) => this.moveToolbar(e));
  }

  moveToolbar(event) {
    if (this.isDragging && !this.win.isResizing) {
      const newX = Math.min(Math.max(0, event.clientX - this.offsetX), window.innerWidth - this.element.offsetWidth);
      const newY = Math.max(30, Math.min(event.clientY - this.offsetY, window.innerHeight - this.win.element.offsetHeight));
      this.win.updateAttributes(newY + 'px', newX + 'px', this.win.element.style.width, this.win.element.style.height);
    }
  }

  startDragging(event) {
    this.win.focus();
    this.isDragging = true;
    this.offsetX = event.clientX - this.element.getBoundingClientRect().left;
    this.offsetY = event.clientY - this.element.getBoundingClientRect().top;
    document.body.style.cursor = "grab";
  }

  stopDragging() {
    this.isDragging = false;
    document.body.style.cursor = "default";
  }

  updateName(name) {
    this.title.textContent = name;
  }

  create() {
    this.win.element.appendChild(this.element);
    this.buttons = ['close', 'minimize', 'maximize'].map(type => new ToolbarButton(this.win, type));
    this.buttons.forEach(button => button.create(this.element));

    this.title.textContent = this.win.process.name;
    this.element.appendChild(this.title);
  }
}

class ToolbarButton {
  constructor(win, type) {
    this.win = win;
    this.type = type;
    this.element = document.createElement("div");
    this.element.className = `ToolbarButton ToolbarButton-${type}`;
    this.windowState = null;
  }

  create(toolbar) {
    toolbar.appendChild(this.element);
    this.element.addEventListener("click", () => this.handleClick());
  }

  handleClick() {
    this.win.element.style.transition = "all 0.3s ease";
    switch (this.type) {
      case "close":
        this.win.element.style.opacity = "0";
        setTimeout(() => this.win.process.quit(), 300);
        break;
      case "minimize":
        this.win.setVisibility(false);
        break;
      case "maximize":
        this.win.focus();
        this.win.fullScreen = !this.win.fullScreen;
        if (this.win.fullScreen) {
          this.windowState = {
            top: this.win.element.style.top,
            left: this.win.element.style.left,
            width: this.win.element.style.width,
            height: this.win.element.style.height
          };
          this.win.updateAttributes("30px", "0px", "100%", "calc(100% - 30px)");
        } else {
          this.win.updateAttributes(this.windowState.top, this.windowState.left, this.windowState.width, this.windowState.height);
        }
        setTimeout(() => this.win.element.style.transition = "", 300);
        break;
    }
  }
}
