import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerUrlPipe } from './dom-sanitizer-url.pipe';
import { ImpuroPipe } from './impuro.pipe';
import { ImagePipe } from './image.pipe';
import { PipesPipe } from './filtro-municipio.pipe';
import { FiltroColegiosPipe } from './filtro-colegios.pipe';
import { FiltroCursosPipe } from './filtro-cursos.pipe';
import { DomStyleBackgroundPipe } from './dom-style-background.pipe';



@NgModule({
  declarations: [
    DomSanitizerUrlPipe,
    ImpuroPipe,
    ImagePipe,
    PipesPipe,
    FiltroColegiosPipe,
    FiltroCursosPipe,
    DomStyleBackgroundPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DomSanitizerUrlPipe,
    ImpuroPipe,
    ImagePipe,
    PipesPipe,
    FiltroColegiosPipe,
    FiltroCursosPipe, 
    DomStyleBackgroundPipe
  ]
})
export class PipesModule { }
