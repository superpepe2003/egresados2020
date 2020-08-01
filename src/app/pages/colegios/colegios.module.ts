import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColegiosPageRoutingModule } from './colegios-routing.module';

import { ColegiosPage } from './colegios.page';
import { ColegioModule } from '../../components/colegio/colegio.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    IonicModule,
    ColegioModule,
    ColegiosPageRoutingModule
  ],
  declarations: [ColegiosPage]
})
export class ColegiosPageModule {}
