import { Component, input, output, } from '@angular/core';
import { Task } from '../task';
import { TooltipDirective } from '../../shared/ui/tooltip';
import { TaskDeadlinePipe } from '../task-deadline-pipe';
import { isDeadlineExpired } from '../task-deadline';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  imports: [TooltipDirective, TaskDeadlinePipe, DatePipe, NgClass],
  selector: 'app-task-card',
  styleUrl: './task-card.scss',
  templateUrl: './task-card.html',
  standalone: true,
})
export class TaskCard {
  task = input.required<Task>();
  isSelected = input<boolean>(false);
  toggled = output<Task>({ alias: 'toggle' });
  selected = output<Task>({ alias: 'select' });
  protected readonly isDeadlineExpired = isDeadlineExpired;

  toggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.task());
  }

  select(): void {
    this.selected.emit(this.task());
  }
}
