import { computed, effect, inject, Service, signal } from '@angular/core';
import { Task } from './task';
import { TaskRepository } from './task-repository';

@Service()
export class TaskStore {

  private readonly taskRepository = inject(TaskRepository);
  tasks = signal<Task[]>(this.taskRepository.getTasks());

  selectedTask = signal<Task | null>(null);
  activeTasksCount = computed(() => this.tasks().filter((task) => !task.completed).length);

  constructor() {
    effect(() => {
      this.taskRepository.saveTasks(this.tasks())
    });
  }

  toggleTask(taskToToggle: Task) {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task
      )
    );

    if (this.selectedTask()?.id === taskToToggle.id) {
      const updatedTask = this.tasks().find((task) => task.id === taskToToggle.id) || null;
      this.selectedTask.set(updatedTask);
    }
  }

  deleteTask(id: number) {
    if (this.selectedTask()?.id === id) {
      this.selectedTask.set(null);
    }
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  addTask(title: string, description: string): boolean {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      return false;
    }

    const tasks = this.tasks();
    const lastTask = tasks[tasks.length - 1];

    const newTask: Task = {
      id: lastTask ? lastTask.id + 1 : 1,
      title: trimmedTitle,
      completed: false,
      description: trimmedDescription,
      priority: null,
      createdAt: new Date().toISOString(),
      deadline: null
    };

    this.tasks.update((currentTasks) => [...currentTasks, newTask]);
    return true;
  }


  selectTask(task: Task | null): boolean {
    if (this.selectedTask()?.id === task?.id) {
      return false;
    }

    this.selectedTask.set(task);
    return true;
  }


}
