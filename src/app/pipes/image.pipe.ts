import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor( private dom: DomSanitizer) {}

  transform( img: any ): any {
    return this.dom.bypassSecurityTrustUrl( img );
  }

}
