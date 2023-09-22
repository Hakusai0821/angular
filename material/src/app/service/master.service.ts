import { Injectable } from '@angular/core';
import {colorentity} from '../Entity/colorentity';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor() { }

  GetColorList():colorentity[]{
    return [ 
      {code:'c0',name:'Black'},
      {code:'c1',name:'Red'},
      {code:'c2',name:'Green'},
      {code:'c4',name:'white'},
    ]
  }
}
