import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';

@Component({
  imports: [],
  selector: 'app-task-details',
  styleUrl: './task-details.scss',
  templateUrl: './task-details.html',
  standalone: true,
})
export class TaskDetails {
  @Input({ required: true }) task!: Task;
  @Output('close') closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
