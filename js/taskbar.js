export class Taskbar {
    constructor(os) {
      this.os = os;
      this.element = document.createElement('div');
      this.element.className = 'Taskbar';
  
      this.indicator = document.createElement('div');
      this.indicator.className = 'TasksIndicator';
  
      this.tasks = [];
    }
  
    create() {
      document.getElementById('root').appendChild(this.element); // Assuming 'root' is an existing ID
      this.element.appendChild(this.indicator);
    }
  
    addTask(process) {
      const task = new TaskIcon(this, process);
      task.create();
      this.tasks.push(task);
      this.indicator.appendChild(task.element);
    }
  
    removeTask(pid) {
      const taskIndex = this.tasks.findIndex(t => t.process_pid === pid);
      if (taskIndex !== -1) {
        const task = this.tasks[taskIndex];
        task.destroy();
        this.tasks.splice(taskIndex, 1);
      }
    }
  }
  
  class TaskIcon {
    constructor(taskbar, process) {
      this.taskbar = taskbar;
      this.process = process;
      this.process_pid = process.pid;
      this.element = document.createElement('div');
      this.element.className = 'TaskIcon';
    }
  
    create() {
      this.element.addEventListener('click', () => this.handleClick());
      this.updateIconBasedOnProcess();
      this.taskbar.element.appendChild(this.element);
      this.updateTaskIconAppearance(this.process.window.isVisible);
    }
  
    handleClick() {
      const isVisible = !this.process.window.isVisible;
      this.updateTaskIconAppearance(isVisible);
      this.process.window.setVisibility(isVisible);
    }
  
    updateTaskIconAppearance(isVisible) {
      if (isVisible) {
        this.element.style.backgroundColor = 'rgba(255,255,255,0.3)';
      } else {
        this.element.style.backgroundColor = '';
      }
    }
  
    updateIconBasedOnProcess() {
      const iconPath = {
        python: "url('img/apps/python/icon.png')",
        shell: "url('img/apps/shell/icon.png')",
        default: "url('img/unknown.png')"
      };
      this.element.style.backgroundImage = iconPath[this.process.name] || iconPath.default;
    }
  
    destroy() {
      this.element.style.transition = 'all 0.1s ease';
      this.element.style.opacity = '0';
      setTimeout(() => this.element.remove(), 100);
    }
  }
  