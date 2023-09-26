import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-watchvalue-child',
  templateUrl: './watchvalue-child.component.html',
  styleUrls: ['./watchvalue-child.component.css']
})
export class WatchvalueChildComponent {
 @Input() count!: number;
 @Output() countChange = new EventEmitter()

 //子組件修改數據
 setCount(){
  this.countChange.emit(this.count + 1)
 }

}
