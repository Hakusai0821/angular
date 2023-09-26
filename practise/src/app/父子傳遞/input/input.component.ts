import {
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.css"],
})
export class InputComponent {
  // 使用@Input接收
  @Input() value!: string;
  //使用別名避免衝突
  // @Input('name') myname!:string

  // 聲明一個事件對象，來接收父組件傳遞的事件
  @Output() setValue = new EventEmitter();
  //使用別名避免衝突
  // @Output('setValue') mySetValue = new EventEmitter();
  
  sentValue(event: any) {
    // 透過target拿到input框再透過value拿到值，再用emit發送給父級setValue透過output傳遞回去
    this.setValue.emit(event.target.value);
    // this.mySetValue.emit(event.target.value);
                   //  如果emit()要傳遞多個只能以 emit([陣列])或emit({物件})
  }
}
