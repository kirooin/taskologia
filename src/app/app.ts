import { Component, computed, effect, ElementRef, signal, ViewChild } from '@angular/core';
import { Task } from './tasks/task';
import { FormsModule } from '@angular/forms';
import { TaskCard } from './tasks/task-card/task-card';
import { TaskDetails } from './tasks/taks-details/task-details';
import { TooltipDirective } from './shared/ui/tooltip';
import { ShowIfValueDirective } from './shared/ui/show-if-value';

type taskDraft = {
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

  taskTitle = signal('');
  selectedTask = signal<Task | null>(null);

  tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Изучить компоненты Angular',
      completed: true,
      description:
        'Разобраться с декораторами @Component, жизненным циклом, Input/Output и встроенным control flow (@if, @for)',
      createdAt: '2026-10-20T10:32:14.000Z',
      deadline: '2026-10-20T15:32:14.000Z',
      priority: null,
    },
    {
      id: 2,
      title: 'Разобраться с binding',
      completed: false,
      description: '',
      createdAt: '2026-10-20T17:32:14.000Z',
      deadline: '2026-10-21T11:30:14.000Z',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Сделать первый мини-проект на Angular с тремя компонентами и двумя пайпами',
      completed: false,
      description:
        'Собрать небольшое приложение: несколько компонентов, общий state на уровне родителя, кастомные пайпы для форматирования данных.',
      createdAt: '2026-10-10T17:32:14.000Z',
      deadline: '2026-10-27T11:30:14.000Z',
      priority: 'high',
    },
  ]);

  taskDescription = signal('');
  activeTasksCount = computed(() => this.tasks().filter((task) => !task.completed).length);

  constructor() {
    const savedDraft = localStorage.getItem(this.taskDraftStorageKey);
    if (savedDraft) {
      const draft: taskDraft = JSON.parse(savedDraft);
      this.taskTitle.set(draft.title || '');
      this.taskDescription.set(draft.description || '');
    }

    effect(() => {
      const draft: taskDraft = {
        title: this.taskTitle(),
        description: this.taskDescription(),
      };
      localStorage.setItem(this.taskDraftStorageKey, JSON.stringify(draft));
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

  addTask() {
    const title = this.taskTitle().trim();
    const description = this.taskDescription().trim();

    if (!title) {
      this.taskInput.nativeElement.focus();
      return;
    }

    const tasks = this.tasks();
    const lastTask = tasks[tasks.length - 1];

    const newTask: Task = {
      id: lastTask ? lastTask.id + 1 : 1,
      title,
      completed: false,
      description,
      priority: null,
      createdAt: new Date().toISOString(),
      deadline: null,
    };

    this.tasks.update((currentTasks) => [...currentTasks, newTask]);

    this.taskTitle.set('');
    this.taskDescription.set('');
  }

  deleteTask(id: number) {
    if (this.selectedTask()?.id === id) {
      this.selectedTask.set(null);
    }
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  clearTaskInput(): void {
    this.taskTitle.set('');
    this.taskInput.nativeElement.focus();
  }

  closeDetails(): void {
    this.selectedTask.set(null);
  }

  selectTask(task: Task) {
    if (this.selectedTask()?.id === task.id) {
      // highlight
      this.taskDetails?.highLightPanel();
    } else {
      this.selectedTask.set(task);
    }
  }
}
