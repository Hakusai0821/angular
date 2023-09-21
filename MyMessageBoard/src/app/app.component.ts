import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  onClick(value:string):void{
    alert("Hello"+value);
  }
}

// content = '這是段文字';
// name = '';


