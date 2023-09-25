import { Component } from '@angular/core';
// Constant
import { appPath } from '../../app-path.const';
@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent {
 /**
   * 給 Template 用的路由定義
   *
   * @memberof CustomerInfoComponent
   */
 path = appPath;
}
