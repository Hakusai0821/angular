import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Hero } from "../hero";
import { ServiceService } from "../service.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit{


  showSecret = false
  applyForm!: FormGroup; // 定義一個表單稱為applyForm，並且表單的型別為FormGroup，也就是表單的集合。
  constructor(private fb: FormBuilder,private heroService:ServiceService) { } // 將表單相關元件啟動，並給予名稱fb
  ngOnInit() {
      this.applyForm = this.fb.group({ // 在元件啟動的時候建立每個表單的控制元件
          userName: ["可以預設資料",Validators.required],
          password: ["",[Validators.required,Validators.minLength(6)]],
          secret:[""],
          email: ["",Validators.required,Validators.email]
      });
      this.detectSecret()
  }

  sendForm(){
    console.log(this.applyForm.value)
    alert('成功送出表單')
    this.applyForm.reset({
      userName:'',
      password:'',
      secret:'',
      email:''
    })
  }

  // onDel(item: Hero,event:any){
  //   this.onChangeItem.emit({item})
  // }




  //暗語//
  detectSecret(){
    const secret$=this.applyForm.get('secret')//取得secret的控制元件
    //透過 valueChanges 屬性來訂閱 secret$ 的值變化事件，當 secret$ 的值變化時，執行訂閱函式內的程式碼。
    // 監聽secret控制元件的變化，如果有變化，將變化的值傳遞出去
    secret$?.valueChanges.subscribe(e=>{
      console.log(e)
      //修改值
      if(e==='secret'){
        this.showSecret=true
        this.applyForm.patchValue({
          talk:''
        })
      }else{
        this.showSecret=false
      }
      // callback(e); // 調用回呼函式，將 e 傳遞出去
    })
  }
}
