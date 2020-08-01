import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'impuro',
  pure: false
})
export class ImpuroPipe implements PipeTransform {

  transform(value: any): unknown {
    return value;
  }

}
