import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-children",
  templateUrl: "./children.component.html",
  styleUrls: ["./children.component.css"],
})
export class ChildrenComponent {
  //屬性和事件對象的前綴必須一致
  @Input() master!: string;
  @Output() masterChange = new EventEmitter();

  oninput(e: any) {
    this.masterChange.emit(e.target.value);
  }
}
