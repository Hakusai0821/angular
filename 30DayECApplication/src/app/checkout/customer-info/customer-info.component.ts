import { Component } from '@angular/core';
// Constant
import { appPath } from '../../app-path.const';
@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent {
  /**
   * 給 Template 用的路由定義
   *
   * @memberof CustomerInfoComponent
   */
  path = appPath;
}
