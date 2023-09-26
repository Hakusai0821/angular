import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let[a,b,c,d]=args;
    if(a&&b&&c&&d){
    return value.split('').reverse().join(",")+ a+b+'但我的班級是'+c+d;
    }
    return value.split('').reverse().join(",")
  }

}
