import { Component } from '@angular/core';
import { Task } from './tasks/task';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  styleUrl: './app.scss',
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  taskTitle: string = '';

  tasks: Task[] = [
    { id: 1, title: 'Изучить компоненты Angular', completed: true },
    { id: 2, title: 'Разобраться с binding', completed: false },
    {
      id: 3,
      title: 'Сделать первый мини-проект на Angular с тремя компонентами и двумя пайпами',
      completed: false,
    },
  ];

  toggleTask(task: Task) {
    task.completed = !task.completed;
  }

  addTask() {
    const title = this.taskTitle.trim();

    if (!title) {
      return;
    }

    this.tasks.push({
      id: this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1,
      title,
      completed: false,
    });

    this.taskTitle = '';
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  getActiveTasksCount(): number {
    return this.tasks.filter((task) => !task.completed).length;
  }
}
