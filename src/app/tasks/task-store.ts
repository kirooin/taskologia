import { computed, effect, inject, Service, signal } from '@angular/core';
import { Task, TaskBaseModel } from './task';
import { TaskRepository } from './task-repository';

@Service()
export class TaskStore {
  private readonly taskRepository = inject(TaskRepository);
  tasks = signal<Task[]>(this.taskRepository.getTasks());

  selectedTask = signal<Task | null>(null);
  activeTasksCount = computed(() => this.tasks().filter((task) => !task.completed).length);

  constructor() {
    effect(() => {
      this.taskRepository.saveTasks(this.tasks());
    });
  }

  toggleTask(taskToToggle: Task) {
    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === taskToToggle.id ? { ...task, completed: !task.completed } : task,
      ),
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

  addTask(taskData: TaskBaseModel): boolean {
    const trimmedTitle = taskData.title.trim();
    const trimmedDescription = taskData.description.trim();

    if (!trimmedTitle) {
      return false;
    }

    const tasks = this.tasks();
    const lastTask = tasks[tasks.length - 1];

    const newTask: Task = {
      id: lastTask ? lastTask.id + 1 : 1,
      title: taskData.title,
      completed: false,
      description: taskData.description,
      priority: taskData.priority,
      createdAt: new Date().toISOString(),
      deadline: taskData.deadline,
    };

    this.tasks.update((currentTasks) => [...currentTasks, newTask]);
    return true;
  }

  updateTask(id: number, taskData: TaskBaseModel): boolean {
    const trimmedTitle = taskData.title.trim();
    const trimmedDescription = taskData.description.trim();

    if (!trimmedTitle) {
      return false;
    }

    this.tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: trimmedTitle,
              description: trimmedDescription,
              priority: taskData.priority,
              deadline: taskData.deadline,
            }
          : task,
      ),
    );
    if (this.selectedTask()?.id === id) {
      const updatedTask = this.tasks().find((task) => task.id === id) || null;
      this.selectedTask.set(updatedTask);
    }

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
