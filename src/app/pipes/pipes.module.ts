import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerUrlPipe } from './dom-sanitizer-url.pipe';
import { ImpuroPipe } from './impuro.pipe';
import { ImagePipe } from './image.pipe';



@NgModule({
  declarations: [
    DomSanitizerUrlPipe,
    ImpuroPipe,
    ImagePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DomSanitizerUrlPipe,
    ImpuroPipe,
    ImagePipe
  ]
})
export class PipesModule { }
