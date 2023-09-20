import { Component, Input, OnInit } from '@angular/core';
import { Task } from "../../model/task";
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() tasks!: Task[];

  constructor() {}

  ngOnInit(): void {}
}
