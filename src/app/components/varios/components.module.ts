import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '../../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { UsuarioModule } from '../usuario/usuario.module';

import { MenuComponent } from './menu/menu.component';
import { FotoComponent } from './foto/foto.component';
import { TxtInputComponent } from './txt-input/txt-input.component';



@NgModule({
  declarations: [
    MenuComponent,
    FotoComponent,
    TxtInputComponent
  ],
  imports: [
    UsuarioModule,
    CommonModule,
    IonicModule,
    PipesModule,
    RouterModule
  ],
  exports: [
    MenuComponent,
    FotoComponent,
    TxtInputComponent
  ]
})
export class ComponentsModule { }
