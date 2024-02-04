export class Infobar {
    constructor(os) {
        this.os = os;
        this.element = document.createElement("div");
        this.element.className = "Infobar";
        this.osName = null;
        this.processCount = 0;

        this.osName = document.createElement("div");
        this.osName.className = "Indicator";
        this.osName.id = "OSName";

        this.processCount = document.createElement("div");
        this.processCount.className = "Indicator";
        this.processCount.id = "ProcessCount";

        this.clock = document.createElement("div");
        this.clock.className = "Indicator";
        this.clock.id = "Clock";
    }

    create(root) {
        root.appendChild(this.element);
        this.osName.textContent = "OS: " + this.os.name + " v" + this.os.getVersion();
        this.element.appendChild(this.osName);
        this.element.appendChild(this.processCount);
        this.element.appendChild(this.clock);

        this.refresh();
    }

    refresh() {
        this.processCount.textContent = "Processes: " + this.os.processes.length;
        this.clock.textContent = getCurrentTimeFormatted();
    }
}

function getCurrentTimeFormatted() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const minutesPadded = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}h : ${minutesPadded}m`;
}