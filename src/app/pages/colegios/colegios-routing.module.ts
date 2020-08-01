import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColegiosPage } from './colegios.page';

const routes: Routes = [
  {
    path: '',
    component: ColegiosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColegiosPageRoutingModule {}
