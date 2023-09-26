import { Component } from "@angular/core";

@Component({
  selector: "app-watchvalue",
  templateUrl: "./watchvalue.component.html",
  styleUrls: ["./watchvalue.component.css"],
})
export class WatchvalueComponent {
  //父組件如何監聽子組件修改值的變化
  //count === 5 ? 提示
  // 使用 _下畫線表示不對外使用
  _count = 1;
  //監聽count的變化
  get count(){
    return this._count
  }
  set count(v:number){
    this._count=v;
    //對質的改變做監聽
    console.log(v)
    if(v>=5){
      alert('今日訪問次數已達上限')
    }
  }
}
