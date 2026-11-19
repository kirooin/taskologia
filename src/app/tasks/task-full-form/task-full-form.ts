import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { Task, TaskBaseModel, TaskPriorityType } from '../task';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { TaskStore } from '../task-store';
import { NgClass } from '@angular/common';
import { formatDateTimeLocalToIso, formatIsoToDateTimeLocal } from './deadline-date-format';

@Component({
  imports: [FormRoot, FormField, NgClass],
  selector: 'app-task-full-form',
  styleUrl: './task-full-form.scss',
  templateUrl: './task-full-form.html',
  standalone: true,
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class TaskFullForm implements OnInit {
  private readonly taskStore = inject(TaskStore);
  closed = output<void>({ alias: 'close' });

  taskModel = signal<TaskBaseModel>(this.getInitialModel());
  task = input<Task | null>(null);

  taskForm = form(
    this.taskModel,
    (schemaPath) => {
      required(schemaPath.title, { message: 'Введите название задачи' });
      minLength(schemaPath.title, 3, { message: 'Название должно содержать минимум 3 символа.' });
    },
    {
      submission: {
        action: async (field) => {
          const editingTask = this.task();
          const value = field().value();

          const taskData = {
            ...value,
            deadline: value.deadline ? formatDateTimeLocalToIso(value.deadline) : null,
          };
          const success = editingTask
            ? this.taskStore.updateTask(editingTask.id, taskData)
            : this.taskStore.addTask(taskData);

          if (!success) {
            return {
              kind: 'save-error',
              message: 'Не удалось сохранить задачу',
              fieldTree: field,
            };
          }
          return this.close();
        },
      },
    },
  );

  priorities: { value: TaskPriorityType; label: string }[] = [
    { value: null, label: 'Нет' },
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' },
  ];

  ngOnInit() {
    this.taskModel.set(this.getInitialModel(this.task()));
  }

  close() {
    this.closed.emit();
  }

  private getCreateModel(): TaskBaseModel {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return {
      title: '',
      description: '',
      priority: null,
      deadline: formatIsoToDateTimeLocal(date),
    };
  }

  private getEditModel(task: Task): TaskBaseModel {
    return {
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline ? formatIsoToDateTimeLocal(new Date(task.deadline)) : null,
    };
  }

  private getInitialModel(task: Task | null = null): TaskBaseModel {
    if (task) {
      return this.getEditModel(task);
    }

    return this.getCreateModel();
  }
}
