import { Component, OnDestroy } from '@angular/core';
import { IColegio } from '../../models/colegio';
import { Subscription } from 'rxjs';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AgregarColePage } from '../../components/colegio/agregar/agregar-cole.page';
import { ColesService } from '../../services/coles.service';
import { AuthService } from '../../services/auth.service';
import { UbicarTodosComponent } from '../../components/mapas/ubicar-todos/ubicar-todos.component';

@Component({
  selector: 'app-colegios',
  templateUrl: './colegios.page.html',
  styleUrls: ['./colegios.page.scss'],
})
export class ColegiosPage implements OnDestroy {

  colegios: IColegio[];
  colegiosFiltrados: IColegio[];
  subColes: Subscription;

  aplicarFiltro = '';

  buscar = '';

  constructor( public mCole: ColesService,
               public mAuth: AuthService,
               private modalCtrl: ModalController,
               public actionSheetController: ActionSheetController) {

  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.cargarCole();
  }

  cargarCole(){
    // this.mCole.getColegiosVendedorPruebas( this.mAuth.usuario._id );
    if ( this.mAuth.usuario.role === 'ADMIN' ){
      this.mCole.getColegios();
    } else {
      this.mCole.getColegiosVendedor( this.mAuth.usuario._id );
    }
  }


  async agregarCole() {
    const agregaModal = await this.modalCtrl.create({
      component: AgregarColePage
    });

    await agregaModal.present();

    const { data } = await agregaModal.onDidDismiss();
    if ( data ){
      if ( data.ok ){
        this.cargarCole();
      }
    }

  }

  async ubicarTodos() {
    const ubicarTodosModal = await this.modalCtrl.create({
      component: UbicarTodosComponent,
      componentProps: {
        colegios: this.mCole.colegios
      }
    });

    await ubicarTodosModal.present();

  }

  filtrar( e ) {

    this.aplicarFiltro = e.detail.value;

  }

  ngOnDestroy() {
    if ( this.subColes ) {
      this.subColes.unsubscribe();
    }

    this.colegios = [];
    this.colegiosFiltrados = [];

    console.log('Salgo');
  }

}
