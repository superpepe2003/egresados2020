import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domSanitizerUrl'
})
export class DomSanitizerUrlPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this.domSanitizer.bypassSecurityTrustResourceUrl( value );
  }

}
