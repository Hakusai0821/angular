import { Injectable } from '@angular/core';
import {Hero} from './hero'
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor() { }
  member:Array<Hero> =[
    {userName:'王大明',pwd:'234',email:'ee@eee'},
    {userName:'楊小美',pwd:'234',email:'ee@eee'},
  ]
}
