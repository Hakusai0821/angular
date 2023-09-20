import { Directive,ElementRef,Input, Renderer2 } from '@angular/core';
import { TaskState } from '../enum/task-state';

@Directive({
  selector: '[appTaskStateColor]'
})
export class TaskStateColorDirective {

  @Input("appTaskStateColor") state!: TaskState;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.clearElementClass();
    this.addClassByState();
  }

  private clearElementClass(): void {
    const classNames = ["none", "doing", "finish"];
    classNames.forEach((className) =>
      this.renderer.removeClass(this.elRef.nativeElement, className)
    );
  }

  private addClassByState(): void {
    let className: string;
    switch (this.state) {
      case TaskState.None:
        className = "none";
        break;
      case TaskState.Doing:
        className = "doing";
        break;
      case TaskState.Finish:
        className = "finish";
        break;
    }
    this.renderer.addClass(this.elRef.nativeElement, className);
  }
}
