import { Component, input, output, } from '@angular/core';
import { Task } from '../task';
import { TooltipDirective } from '../../shared/ui/tooltip';

@Component({
  imports: [TooltipDirective],
  selector: 'app-task-card',
  styleUrl: './task-card.scss',
  templateUrl: './task-card.html',
  standalone: true,
})
export class TaskCard {
  task = input.required<Task>();
  isSelected = input<boolean>(false);
  toggled = output<Task>({ alias: 'toggle' });
  deleted = output<number>({ alias: 'delete' });
  selected = output<Task>({ alias: 'select' });

  toggle(event: Event): void {
    event.stopPropagation();
    this.toggled.emit(this.task());
  }

  delete(event: Event): void {
    event.stopPropagation();
    this.deleted.emit(this.task().id);
  }

  select(): void {
    this.selected.emit(this.task());
  }
}
