import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'soma'
})
export class SomaPipe implements PipeTransform {

  transform(value: string[]): string {
    return value
      .map(item => parseFloat(item))
      .reduce((p, c) => p + c).toFixed(2);
  }

}
