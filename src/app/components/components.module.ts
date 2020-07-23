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
import { MapaUbicarComponent } from './colegio/mapaubicar/mapa-ubicar.component';
import { ColegioPopoverComponent } from './colegio/colegio-popover/colegio-popover.component';
import { UbicarComponent } from './colegio/ubicar/ubicar.component';



//COMPONENTE DE ALUMNO
import { AlumnoComponent } from './alumno/alumnocomponent/alumno.component';
import { AlumnosComponent } from './alumno/alumnoscomponent/alumnos.component';
import { ListarComponent } from './alumno/listar/listar.component';
import { UbicarTodosComponent } from './colegio/ubicar-todos/ubicar-todos.component';
import { MenuComponent } from './varios/menu/menu.component';
import { RouterModule } from '@angular/router';
import { ModificarPerfilComponent } from './usuario/modificar-perfil/modificar-perfil.component';
import { FotoComponent } from './varios/foto/foto.component';
import { AgregarComponent } from './usuario/agregar/agregar.component';



@NgModule({
  declarations: [
    MenuComponent,
    FotoComponent,
    AgregarColePage,
    ColegiosComponent,
    ColegioComponent,
    ColegioPopoverComponent,
    MapaUbicarComponent,
    ListarComponent,
    AlumnoComponent,
    AlumnosComponent,
    UbicarComponent,
    UbicarTodosComponent,
    ModificarPerfilComponent,
    AgregarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AgmCoreModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule
  ],
  exports: [
    MenuComponent,
    AgregarColePage,
    ColegiosComponent,
    MapaUbicarComponent,
    UbicarComponent,
    ListarComponent,
    UbicarTodosComponent,
    ModificarPerfilComponent,
    AlumnosComponent,
    AgregarComponent
  ]
})
export class ComponentsModule { }
