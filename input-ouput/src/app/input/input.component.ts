import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `
    Name 
    <input [(ngModel)]="name" (input)="nameChange.emit(name)">
    <p>{{name}}</p>
  `,
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  // 使用@Input接收
  @Input() name!: string;
  //使用別名避免衝突
  // @Input('name') myname!:string

  @Output() nameChange = new EventEmitter();;

doSomething():any{
    console.log(1)
  }
}


