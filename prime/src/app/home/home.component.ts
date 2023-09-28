import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: any;
  constructor(public route:ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((res)=>{
      this.name=res['name']
      console.log(res['name'])
    })
  }
}
