import { Component, inject, ViewChild } from '@angular/core';
import { Task } from './tasks/task';
import { FormsModule } from '@angular/forms';
import { TaskCard } from './tasks/task-card/task-card';
import { TaskDetails } from './tasks/task-details/task-details';
import { TaskStore } from './tasks/task-store';
import { TaskQuickForm } from './tasks/task-quick-form/task-quick-form';

@Component({
  selector: 'app-root',
  imports: [FormsModule, TaskCard, TaskDetails, TaskQuickForm],
  styleUrl: './app.scss',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  @ViewChild(TaskDetails) taskDetails?: TaskDetails;

  private readonly taskStore = inject(TaskStore);

  tasks = this.taskStore.tasks;
  selectedTask = this.taskStore.selectedTask;
  activeTasksCount = this.taskStore.activeTasksCount;

  toggleTask(task: Task) {
    this.taskStore.toggleTask(task);
  }

  deleteTask(id: number) {
    this.taskStore.deleteTask(id);
  }

  addTask() {}

  closeDetails(): void {
    this.selectedTask.set(null);
  }

  selectTask(task: Task | null): void {
    const taskSelected = this.taskStore.selectTask(task);
    if (!taskSelected) {
      this.taskDetails?.highLightPanel();
    }
  }
}
