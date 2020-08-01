import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgregarColePage } from './agregar/agregar-cole.page';
import { ColegiosComponent } from './colegioscomponent/colegios.component';
import { ColegioComponent } from './colegiocomponent/colegio.component';
import { ColegioPopoverComponent } from './colegio-popover/colegio-popover.component';
import { MapasModule } from '../mapas/mapas.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlumnoModule } from '../alumno/alumno.module';



@NgModule({
  declarations: [
    AgregarColePage,
    ColegiosComponent,
    ColegioComponent,
    ColegioPopoverComponent
  ],
  imports: [
    AlumnoModule,
    CommonModule,
    PipesModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MapasModule
  ],
  exports: [
    AgregarColePage,
    ColegiosComponent,
    ColegioPopoverComponent
  ]
})
export class ColegioModule { }
