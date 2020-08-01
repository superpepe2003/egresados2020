import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { AgregarComponent } from './agregar/agregar.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ModificarPerfilComponent,
    AgregarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModificarPerfilComponent,
    AgregarComponent
  ]
})
export class UsuarioModule { }
