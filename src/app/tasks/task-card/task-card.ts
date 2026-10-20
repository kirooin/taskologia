import { Component, input, output, } from '@angular/core';
import { Task } from '../task';
import { TooltipDirective } from '../../shared/ui/tooltip';
import { TaskDeadlinePipe } from '../task-deadline-pipe';

@Component({
  imports: [TooltipDirective, TaskDeadlinePipe],
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

  toggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.task());
  }

  select(): void {
    this.selected.emit(this.task());
  }
}
