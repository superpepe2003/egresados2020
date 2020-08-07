import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPostPage } from './agregar-post.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPostPageRoutingModule {}
