import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarPostPageRoutingModule } from './agregar-post-routing.module';

import { AgregarPostPage } from './agregar-post.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    AgregarPostPageRoutingModule
  ],
  declarations: [AgregarPostPage]
})
export class AgregarPostPageModule {}
