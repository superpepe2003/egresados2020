import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../pipes/pipes.module';

//COMPONENTES DE COLEGIO

import { AgregarColePage } from './colegio/agregar/agregar-cole.page';
import { ColegiosComponent } from './colegio/colegioscomponent/colegios.component';
import { ColegioComponent } from './colegio/colegiocomponent/colegio.component';
import { MapacolegioComponent } from './colegio/mapacomponent/mapacolegio.component';
import { MapaUbicarComponent } from './colegio/mapaubicar/mapa-ubicar.component';
import { ColegioPopoverComponent } from './colegio/colegio-popover/colegio-popover.component';
import { UbicarComponent } from './colegio/ubicar/ubicar.component';



//COMPONENTE DE ALUMNO
import { AlumnoComponent } from './alumno/alumnocomponent/alumno.component';
import { AlumnosComponent } from './alumno/alumnoscomponent/alumnos.component';
import { ListarComponent } from './alumno/listar/listar.component';
import { UbicarTodosComponent } from './colegio/ubicar-todos/ubicar-todos.component';



@NgModule({
  declarations: [
    AgregarColePage,
    ColegiosComponent,
    ColegioComponent,
    ColegioPopoverComponent,
    MapacolegioComponent,
    MapaUbicarComponent,
    ListarComponent,
    AlumnoComponent,
    AlumnosComponent,
    UbicarComponent,
    UbicarTodosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AgmCoreModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    AgregarColePage,
    ColegiosComponent,
    MapaUbicarComponent,
    UbicarComponent,
    ListarComponent,
    UbicarTodosComponent
  ]
})
export class ComponentsModule { }
