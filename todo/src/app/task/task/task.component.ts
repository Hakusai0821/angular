import { Component, OnInit, Input ,OnChanges,Output,EventEmitter} from '@angular/core';
import { Task } from '../../model/task';
import { TaskState } from '../../enum/task-state';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit, OnChanges {

  @Input() subject!: string;

  // private _state!: TaskState;
  // @Input()
  // set state(state: TaskState) {
  //   this._state = state;
  //   this.stateDesc = this.getStateDesc();
  // }
  // get state(): TaskState {
  //   return this._state;
  // }
  @Input() state!: TaskState;
  @Output() stateChange = new EventEmitter<TaskState>();
  stateDesc!: string;
  TaskState = TaskState;

  constructor() {}

  ngOnInit(): void {}
  
  stateClass!: { [key: string]: boolean; };
  
  ngOnChanges(): void {
    this.stateClass ={
      doing: this.state === TaskState.Doing,
      finish: this.state === TaskState.Finish,
    };
    this.stateDesc = this.getStateDesc();
  }

  getStateDesc(): string {
    switch (this.state) {
      case TaskState.None:
        return '未完成';
      case TaskState.Doing:
        return '進行中';
      case TaskState.Finish:
        return '已完成';
    }
  }

  onSetTaskState(state: TaskState): void {
    this.stateChange.emit(state);
  }

  getStateColor(): string {
    switch (this.state) {
      case TaskState.None:
        return 'red';
      case TaskState.Doing:
        return 'green';
      case TaskState.Finish:
        return 'blue';
    }
  }

  getStateStyle(): string {
    switch (this.state) {
      case TaskState.None:
        return 'color:red';
      case TaskState.Doing:
        return 'color: green';
      case TaskState.Finish:
        return 'color: blue';
    }
  }
}
