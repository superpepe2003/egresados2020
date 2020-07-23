import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColegiosPageRoutingModule } from './colegios-routing.module';

import { ColegiosPage } from './colegios.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ColegiosPageRoutingModule
  ],
  declarations: [ColegiosPage]
})
export class ColegiosPageModule {}
