import { inject, Service } from '@angular/core';
import { LocalStorage } from '../shared/local-storage';
import { Task } from './task';

@Service()
export class TaskRepository {
  private readonly localStorage = inject(LocalStorage);
  private readonly storageKey = 'tasks';

  getTasks(): Task[] {
    return this.localStorage.getItem<Task[]>(this.storageKey) ?? [];
  }

  saveTasks(tasks: Task[]): void {
      this.localStorage.setItem<Task[]>(this.storageKey, tasks);
  }
}
