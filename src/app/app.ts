import { Component, inject, signal, ViewChild } from '@angular/core';
import { Task } from './tasks/task';
import { FormsModule } from '@angular/forms';
import { TaskCard } from './tasks/task-card/task-card';
import { TaskDetails } from './tasks/task-details/task-details';
import { TaskStore } from './tasks/task-store';
import { TaskQuickForm } from './tasks/task-quick-form/task-quick-form';
import { TooltipDirective } from './shared/ui/tooltip';
import { TaskFullForm } from './tasks/task-full-form/task-full-form';

@Component({
  selector: 'app-root',
  imports: [FormsModule, TaskCard, TaskDetails, TaskQuickForm, TooltipDirective, TaskFullForm],
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

  isTaskFullFormOpened = signal<boolean>(false);
  editingTask = signal<Task | null>(null);

  toggleTask(task: Task) {
    this.taskStore.toggleTask(task);
  }

  deleteTask(id: number) {
    this.taskStore.deleteTask(id);
  }

  selectTask(task: Task | null): void {
    const taskSelected = this.taskStore.selectTask(task);
    if (!taskSelected) {
      this.taskDetails?.highLightPanel();
    }
  }

  editTask(task: Task): void {
    this.toggleTaskFullFormPopup(true, task);
    this.editingTask.set(task)
  }

  toggleTaskFullFormPopup(open: boolean, taskToEdit: Task | null = null): void {
    this.isTaskFullFormOpened.set(open);
    this.editingTask.set(taskToEdit)
  }
}
