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
  @Input() isSelected = false;
  @Output('toggle') toggled = new EventEmitter<Task>();
  @Output('delete') deleted = new EventEmitter<number>();
  @Output('select') selected = new EventEmitter<Task>();

  toggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.task);
  }

  delete(event: Event): void {
    event.stopPropagation();
    this.deleted.emit(this.task.id);
  }

  select(): void {
    this.selected.emit(this.task);
  }
}
