export class Window {
    constructor(name) {
        this.name = name;
        this.top = 0;
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.element = null;
    }

    create(root) {
        this.element = document.createElement("div");
        this.element.className = "Window";
        this.element.style = `top: ${this.top}px; left: ${this.left}px; width: ${this.width}px; height: ${this.height}px`;
    }

    destroy() {
        this.element.remove();
    }
}