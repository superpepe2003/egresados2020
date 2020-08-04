import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { AlumnoComponent } from './alumnocomponent/alumno.component';
import { AlumnosComponent } from './alumnoscomponent/alumnos.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../varios/components.module';
import { ChartsModule } from 'ng2-charts';
import { GraficoAlumnoComponent } from './grafico-alumno/grafico-alumno.component';



@NgModule({
  declarations: [
    ListarComponent,
    AlumnoComponent,
    AlumnosComponent,
    GraficoAlumnoComponent
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AlumnosComponent
  ]
})
export class AlumnoModule { }
