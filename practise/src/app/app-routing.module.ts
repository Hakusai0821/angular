import { NgModule } from '@angular/core';
import { ParentComponent } from './父子傳遞/parent/parent.component';
import { MasterComponent } from './雙向綁定/master/master.component';
import { WatchvalueComponent } from './監聽值變化/watchvalue/watchvalue.component';
import { IndexComponent } from './todolist/index/index.component';

//引入路由模塊，配置基礎路由
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// 配置一個路由的匹配規則
const routes: Routes = [
  //路由配置不能開頭有斜線/
  {
    path:"",component:ParentComponent
  },
  {
    path:"父子傳遞",component:ParentComponent
  },
  {
    path:"雙向綁定",component:MasterComponent
  },
  {
    path:"監聽值變化",component:WatchvalueComponent
  },
  {
    path:"todolist",component:IndexComponent
  },
];

@NgModule({
  //安裝使用路由配置
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
