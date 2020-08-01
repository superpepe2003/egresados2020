import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaUbicarComponent } from './mapaubicar/mapa-ubicar.component';
import { UbicarTodosComponent } from './ubicar-todos/ubicar-todos.component';
import { UbicarComponent } from './ubicar/ubicar.component';
import { AgmCoreModule } from '@agm/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MapaUbicarComponent,
    UbicarTodosComponent,
    UbicarComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    AgmCoreModule
  ],
  exports: [
    MapaUbicarComponent,
    UbicarTodosComponent,
    UbicarComponent
  ]
})
export class MapasModule { }
