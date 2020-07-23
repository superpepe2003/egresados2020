import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUsuario } from '../../models/usuario';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ModalController } from '@ionic/angular';
import { AgregarComponent } from '../../components/usuario/agregar/agregar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {

  vendedores: Observable<IUsuario[]>;

  constructor( private mAuth: AuthService,
               private modal: ModalController) { }

  ngOnInit() {
    this.cargarVendedores();
  }

  cargarVendedores(){
    this.vendedores = this.mAuth.getVendedores();
  }

  async agregarVendedor() {
      const agregaVende = await this.modal.create({
        component: AgregarComponent
      });

      agregaVende.present();

      const { data } = await agregaVende.onDidDismiss();
      if ( data.ok ){
        this.cargarVendedores();
      }

  }

  ngOnDestroy() {
  }

}
