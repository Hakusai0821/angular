import { Component,OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { colorentity } from 'src/app/Entity/colorentity';
import { MasterService } from 'src/app/service/master.service';


@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit{
  // 能選擇的項目
  colorarray=['Red','Green','Yellow']
  // 儲存自動完成的選項。它將被用來監聽表單控制項的值變化。
  filteroption!:Observable<string[]>
  // 用於監聽表單控制項的值變化。
  formcontrol=new FormControl('');

  colorarraylist!:colorentity[];
  filteroptionslist!:Observable<colorentity[]>

  constructor(private service:MasterService){
    this.colorarraylist=this.service.GetColorList();
  }

  // 生命週期函式，組件初始化時會被調用
  ngOnInit(): void {
    // formcontrol 是一個 FormControl 物件，它代表了表單中的某個輸入控制項。valueChanges 是一個 Observable，它會在 formcontrol 的值變化時發出事件。
    // pipe 是 RxJS 中的一個函數，它允許您在 Observable 上應用一系列操作符，以處理發出的數據流。將 startWith('') 和 map(value => this._FILTER(value || '')) 兩個操作符應用在 valueChanges 上。
    // this.filteroption=this.formcontrol.valueChanges.pipe(
      // startWith(''): 這個操作符將在 Observable 開始時發出一個初始值為空字串的事件，以確保 Observable 至少有一個初始事件。
      // startWith(''),map(value=>this._FILTER(value||``))
      // 使用 map 函數來處理 valueChanges 發出的事件。它呼叫 _FILTER 函數，並將當前的值 value 傳遞給它，或者如果值為空則傳遞一個空字串。
    // )
    this.filteroptionslist=this.formcontrol.valueChanges.pipe(
      startWith(''),map(value=>this._LISTFILTER(value||``))
    )
  }
  private _FILTER(value:string):string[]{
    // 将传入的 value 参数转换为小写，使用 toLocaleLowerCase() 方法。这个步骤确保进行不区分大小写的搜索，即不管输入的搜索词是大写还是小写，都能匹配到相应的结果。
    const searchvalue=value.toLocaleLowerCase();
    return this.colorarray.filter(option=>option.toLocaleLowerCase().includes(searchvalue));
  }

  private _LISTFILTER(value:string):colorentity[]{
    // 将传入的 value 参数转换为小写，使用 toLocaleLowerCase() 方法。这个步骤确保进行不区分大小写的搜索，即不管输入的搜索词是大写还是小写，都能匹配到相应的结果。
    const searchvalue=value.toLocaleLowerCase();
    return this.colorarraylist.filter(option=>option.name.toLocaleLowerCase().includes(searchvalue)||option.code.toLocaleLowerCase().includes(searchvalue));
  }
}
