import { Component,OnInit } from '@angular/core';
import { Task } from "./model/task";
import { TaskState } from './enum/task-state';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  tasks!: Task[];
  selectedTask!: Task;
  ngOnInit(): void {
    this.tasks = [
      new Task("頁面需要顯示待辦事項主旨"),
      new Task("可以設定待辦事項的狀態", TaskState.Doing),
      new Task("當待辦事項狀態為已完的事項無法編輯事項", TaskState.Finish),
    ];
    this.onSelectTask(0);
  }

  onSelectTask(index: number): void {
    this.selectedTask = this.tasks[index];
  }
  // onStateChange(state: TaskState): void {
  //   this.selectedTask.state = state;
  // }
}
