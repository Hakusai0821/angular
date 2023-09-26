import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './父子傳遞/input/input.component';
import { FormsModule } from '@angular/forms';
import { MasterComponent } from './雙向綁定/master/master.component';
import { ChildrenComponent } from './雙向綁定/children/children.component';
import { ParentComponent } from './父子傳遞/parent/parent.component';
import { WatchvalueComponent } from './監聽值變化/watchvalue/watchvalue.component';
import { WatchvalueChildComponent } from './監聽值變化/watchvalue-child/watchvalue-child.component';
import { DoneComponent } from './todolist/done/done.component';
import { HeaderComponent } from './todolist/header/header.component';
import { IndexComponent } from './todolist/index/index.component';
import { PlanComponent } from './todolist/plan/plan.component';
import { PrentComponent } from './life/prent/prent.component';
import { ChildComponent } from './life/child/child.component';
import { ReversePipe } from './pipe/reverse.pipe';
import { PipereverseComponent } from './view/pipereverse/pipereverse.component';

//component,指令,管道pipe
@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    MasterComponent,
    ChildrenComponent,
    ParentComponent,
    WatchvalueComponent,
    WatchvalueChildComponent,
    DoneComponent,
    HeaderComponent,
    IndexComponent,
    PlanComponent,
    PrentComponent,
    ChildComponent,
    ReversePipe,
    PipereverseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
