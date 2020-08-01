import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoComponent } from './curso/curso.component';
import { CursosComponent } from './cursos/cursos.component';
import { AgregarCursoComponent } from './agregar-curso/agregar-curso.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResumenComponent } from './resumen/resumen.component';
import { GraficoComponent } from './grafico/grafico.component';
import { ChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from './popover/popover.component';



@NgModule({
  declarations: [
    AgregarCursoComponent,
    CursoComponent,
    CursosComponent,
    ResumenComponent,
    GraficoComponent,
    PopoverComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    IonicModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CursosComponent,
    AgregarCursoComponent,
    ResumenComponent,
    GraficoComponent,
    PopoverComponent
  ]
})
export class CursoModule { }
