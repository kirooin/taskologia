import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TaskBaseModel } from '../task';
import { TaskStore } from '../task-store';
import { LocalStorage } from '../../shared/local-storage';
import { TooltipDirective } from '../../shared/ui/tooltip';
import { ShowIfValueDirective } from '../../shared/ui/show-if-value';

@Component({
  imports: [FormField, FormRoot, TooltipDirective, ShowIfValueDirective],
  selector: 'app-task-quick-form',
  styleUrl: './task-quick-form.scss',
  templateUrl: './task-quick-form.html',
  standalone: true,
})
export class TaskQuickForm {
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  private readonly taskStore = inject(TaskStore);
  private readonly taskDraftStorageKey = 'taskologia-task-draft';
  private readonly localStorage = inject(LocalStorage);

  taskModel = signal<TaskBaseModel>({
    title: '',
    description: '',
  });

  taskForm = form(
    this.taskModel,
    (schemaPath) => {
      required(schemaPath.title, { message: 'Введите название задачи' });
      minLength(schemaPath.title, 3, {
        message: 'Название задачи должно содержать минимум 3 символа',
      });
    },
    {
      submission: {
        action: async (field) => {
          const value = field().value();
          const taskAdded = this.taskStore.addTask(value.title, value.description);

          if (!taskAdded) {
            this.taskInput.nativeElement.focus();
            return;
          }
          field().reset({
            title: '',
            description: '',
          });
        },
      },
    },
  );

  constructor() {
    const savedDraft = this.localStorage.getItem<TaskBaseModel>(this.taskDraftStorageKey);
    if (savedDraft) {
      this.taskModel.set({
        title: savedDraft.title || '',
        description: savedDraft.description || '',
      });
    }

    effect(() => {
      if (this.taskModel().title) {
        const draft: TaskBaseModel = {
          title: this.taskModel().title,
          description: this.taskModel().description,
        };
        this.localStorage.setItem(this.taskDraftStorageKey, draft);
      } else {
        this.localStorage.removeItem(this.taskDraftStorageKey);
      }
    });
  }

  clearTaskInput(): void {
    this.taskForm().reset({
      title: '',
      description: '',
    });
    this.taskInput.nativeElement.focus();
  }
}
