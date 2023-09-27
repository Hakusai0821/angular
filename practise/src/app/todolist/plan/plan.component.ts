import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Template } from "../types";

@Component({
  selector: "app-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.css"],
})
export class PlanComponent {
  @Input("data") list!: Array<Template>;
  @Output() onChangeItem = new EventEmitter

  onSetEdit(item: Template) {
    item.edit = !item.edit;
  }

  //刪除
  onDel(item: Template,event:any){
    // preventDefault 默認行為
    // stopPropagation 阻止冒泡

    // 阻止冒泡
    // event.stopPropagation()
    //告訴負笈把當前這一條數據刪除並且插入到dones的物件中
    this.onChangeItem.emit({...item,from:'plans',to:'dones'})
                  //回傳除了原本item內容 從plans發生到dones
  }

  //確認編輯
  onEnter(item: Template, event: any) {
    if (event.keyCode === 13) {
      this.onSetEdit(item);
    }
  }
}
