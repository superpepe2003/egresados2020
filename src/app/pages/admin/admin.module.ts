import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { ComponentsModule } from '../../components/varios/components.module';
import { UsuarioModule } from '../../components/usuario/usuario.module';
import { AlumnoModule } from '../../components/alumno/alumno.module';

@NgModule({
  imports: [
    CommonModule,
    UsuarioModule,
    AlumnoModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
