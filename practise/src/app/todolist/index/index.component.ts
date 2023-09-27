import { Component } from "@angular/core";
import { Template, renderTemplateData } from "../types";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.css"],
})
export class IndexComponent {
  //plans 計畫中
  // 表示外層是一個陣列，陣列的值是Template的物件
  plans: Array<Template> = [];

  //dones 已完成
  dones: Array<Template> = [];

  //js函數重載:根據參數的不同做出不同的響應
  // 凡是on開頭表示事件函數之類的
  onChangeItem({ id, value, edit, from, to }: Template): any {
    console.log(id, value, edit, from, to);
    if (!from && !to) {
      //從header過來的數據，直接push到plans裡
      return this.plans.push({
        id,
        value,
        edit,
      });
    }
    switch (from) {
      //從plans轉入 dones
      case "plans":
      this.findAndChangeItem(id,this.plans,this.dones);
        break;
      default:
      //刪除
      this.dones.splice(this.dones.findIndex(item=>item.id===id))
    }
  }

  findAndChangeItem(id:number,from:Array<Template>,to:Array<Template>):any{
    let index =from.findIndex(item=>item.id===id)
    if(index===-1){
      return false;
    }
    let item:Template=from.splice(index,1)[0]
    if(item){
      to.push(item)
    }
  }

   //清空所有
   onDelAll(){
    this.dones=[]
    this.plans=[]
   }

}
