import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerUrlPipe } from './dom-sanitizer-url.pipe';
import { ImpuroPipe } from './impuro.pipe';



@NgModule({
  declarations: [
    DomSanitizerUrlPipe,
    ImpuroPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DomSanitizerUrlPipe,
    ImpuroPipe
  ]
})
export class PipesModule { }
