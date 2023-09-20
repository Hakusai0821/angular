import { Component, OnInit } from '@angular/core';
import { Task } from "../../model/task";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  task!: Task;

  ngOnInit(): void {
    this.task = new Task("頁面需要顯示待辦事項主旨");
  }
}
