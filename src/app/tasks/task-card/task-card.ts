import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../task';

@Component({
  imports: [],
  selector: 'app-task-card',
  styleUrl: './task-card.scss',
  templateUrl: './task-card.html',
  standalone: true,
})

export class TaskCard {

  @Input({ required: true }) task!: Task;


  @Output('toggle') toggled = new EventEmitter<Task>();
  @Output('delete') deleted = new EventEmitter<number>();

  toggle() {
    this.toggled.emit(this.task);
  }
  delete() {
    this.deleted.emit(this.task.id);
  }
}
