import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CursoPageRoutingModule } from './curso-routing.module';

import { CursoPage } from './curso.page';
import { ComponentsModule } from '../../components/varios/components.module';
import { CursoModule } from '../../components/curso/curso.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CursoModule,
    ComponentsModule,
    IonicModule,
    PipesModule,
    CursoPageRoutingModule
  ],
  declarations: [CursoPage]
})
export class CursoPageModule {}
