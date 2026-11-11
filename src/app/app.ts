import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Task } from './tasks/task';
import { FormsModule } from '@angular/forms';
import { TaskCard } from './tasks/task-card/task-card';
import { TaskDetails } from './tasks/task-details/task-details';
import { TooltipDirective } from './shared/ui/tooltip';
import { ShowIfValueDirective } from './shared/ui/show-if-value';
import { TaskStore } from './tasks/task-store';
import { LocalStorage } from './shared/local-storage';

type TaskDraft = {
  title: string;
  description: string;
};

@Component({
  selector: 'app-root',
  imports: [FormsModule, TaskCard, TaskDetails, TooltipDirective, ShowIfValueDirective],
  styleUrl: './app.scss',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  @ViewChild(TaskDetails) taskDetails?: TaskDetails;

  private readonly taskDraftStorageKey = 'taskologia-task-draft';
  private readonly taskStore = inject(TaskStore);
  private readonly localStorage = inject(LocalStorage);

  tasks = this.taskStore.tasks;
  selectedTask = this.taskStore.selectedTask;
  activeTasksCount = this.taskStore.activeTasksCount;

  taskTitle = signal('');
  taskDescription = signal('');

  constructor() {
    const savedDraft = this.localStorage.getItem<TaskDraft>(this.taskDraftStorageKey);
    if (savedDraft) {
      this.taskTitle.set(savedDraft.title || '');
      this.taskDescription.set(savedDraft.description || '');
    }

    effect(() => {
      if (this.taskTitle()) {
        const draft: TaskDraft = {
          title: this.taskTitle(),
          description: this.taskDescription(),
        };
        this.localStorage.setItem(this.taskDraftStorageKey, draft);
      } else {
        this.localStorage.removeItem(this.taskDraftStorageKey);
      }
    });
  }

  toggleTask(task: Task) {
    this.taskStore.toggleTask(task);
  }

  deleteTask(id: number) {
    this.taskStore.deleteTask(id);
  }

  addTask() {
    const taskAdded = this.taskStore.addTask(this.taskTitle(), this.taskDescription());

    if (!taskAdded) {
      this.taskInput.nativeElement.focus();
      return;
    }

    this.taskTitle.set('');
    this.taskDescription.set('');
  }

  clearTaskInput(): void {
    this.taskTitle.set('');
    this.taskInput.nativeElement.focus();
  }

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
