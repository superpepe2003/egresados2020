import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerUrlPipe } from './dom-sanitizer-url.pipe';
import { ImpuroPipe } from './impuro.pipe';
import { ImagePipe } from './image.pipe';
import { PipesPipe } from './filtro-municipio.pipe';
import { FiltroColegiosPipe } from './filtro-colegios.pipe';
import { FiltroCursosPipe } from './filtro-cursos.pipe';



@NgModule({
  declarations: [
    DomSanitizerUrlPipe,
    ImpuroPipe,
    ImagePipe,
    PipesPipe,
    FiltroColegiosPipe,
    FiltroCursosPipe
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
    FiltroCursosPipe
  ]
})
export class PipesModule { }
