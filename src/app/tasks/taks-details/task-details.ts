import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { Task } from '../task';
import { TooltipDirective } from '../../shared/ui/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  imports: [TooltipDirective, DatePipe],
  selector: 'app-task-details',
  styleUrl: './task-details.scss',
  templateUrl: './task-details.html',
  standalone: true,
  host: {
    '(document:keydown.escape)': 'closeDetailsByEscape()',
  },
})
export class TaskDetails implements AfterViewInit, OnInit, OnDestroy {
  task = input.required<Task>();
  closed = output<void>({ alias: 'close' });
  deleted = output<number>({ alias: 'delete' });
  @ViewChild('details') details!: ElementRef<HTMLElement>;
  private openingAnimation?: Animation;
  private translateAnimation = 'translateX';

  ngOnInit() {
    if (window.innerWidth <= 900) {
      this.translateAnimation = 'translateY';
    }
  }

  ngAfterViewInit() {
    this.openingAnimation = this.details.nativeElement.animate(
      [
        {
          opacity: 0,
          transform: this.translateAnimation + '(200px)',
        },
        {
          opacity: 1,
          transform: this.translateAnimation + '(0)',
        },
      ],
      {
        duration: 200,
        easing: 'ease-out',
      },
    );
  }

  ngOnDestroy() {
    this.openingAnimation?.cancel();
  }

  close(): void {
    this.openingAnimation = this.details.nativeElement.animate(
      [
        {
          opacity: 1,
          transform: this.translateAnimation + '(0)',
        },
        {
          opacity: 0,
          transform: this.translateAnimation + '(200px)',
        },
      ],
      {
        duration: 220,
        easing: 'ease-out',
      },
    );
    setTimeout(() => {
      this.closed.emit();
    }, 200);
  }

  delete(): void {
    this.deleted.emit(this.task().id);
  }

  highLightPanel(): void {
    this.details.nativeElement.animate(
      [{ background: 'initial' }, { background: '#554874' }, { background: '#initial' }],
      { duration: 500, easing: 'ease' },
    );
  }

  closeDetailsByEscape(): void {
    this.close();
  }
}
