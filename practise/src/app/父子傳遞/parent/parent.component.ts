import { Component } from "@angular/core";

@Component({
  selector: "app-parent",
  templateUrl: "./parent.component.html",
  styleUrls: ["./parent.component.css"],
})
export class ParentComponent {
  //父組件傳遞給子組件數據
  parentValue = "";
  //父組件接收子組件傳遞的數據

  getSon(value: string) {
    //input框更改後將parentValue值傳遞回input更改value
    this.parentValue = value;
  }
}
