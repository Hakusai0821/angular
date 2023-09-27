import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Template } from "../types";

@Component({
  selector: "app-done",
  templateUrl: "./done.component.html",
  styleUrls: ["./done.component.css"],
})
export class DoneComponent {
  @Input("data") list!: Array<Template>;
  @Output() onDelItem = new EventEmitter();
  onDel(item: Template) {
    this.onDelItem.emit({ ...item, from: "dones" });
  }
}
