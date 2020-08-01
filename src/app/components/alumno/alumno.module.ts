import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarComponent } from './listar/listar.component';
import { AlumnoComponent } from './alumnocomponent/alumno.component';
import { AlumnosComponent } from './alumnoscomponent/alumnos.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../varios/components.module';



@NgModule({
  declarations: [
    ListarComponent,
    AlumnoComponent,
    AlumnosComponent,
  ],
  imports: [
    ComponentsModule,
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AlumnosComponent
  ]
})
export class AlumnoModule { }
