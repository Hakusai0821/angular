import { Input, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutocompleteComponent } from './component/autocomplete/autocomplete.component'
import { InputComponent } from './input/input.component';

const routes: Routes = [
  // 當使用者訪問 autocomplete 路徑時，應該顯示 AutocompleteComponent 組件。
  {path:'autocomplete',component:AutocompleteComponent},
  // 當使用者訪問 input 路徑時，應該顯示 InputComponent 組件。
  {path:'input',component:InputComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
