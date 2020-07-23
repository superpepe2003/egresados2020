import { Component, OnDestroy } from '@angular/core';
import { IColegio } from '../../models/colegio';
import { Subscription } from 'rxjs';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AgregarColePage } from '../../components/colegio/agregar/agregar-cole.page';
import { RouteConfigLoadEnd } from '@angular/router';
import { UbicarTodosComponent } from '../../components/colegio/ubicar-todos/ubicar-todos.component';
import { ColegiosPageModule } from './colegios.module';
import { ColesService } from '../../services/coles.service';
import { auth } from 'firebase';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-colegios',
  templateUrl: './colegios.page.html',
  styleUrls: ['./colegios.page.scss'],
})
export class ColegiosPage implements OnDestroy {

  colegios: IColegio[];
  colegiosFiltrados: IColegio[];
  subColes: Subscription;

  buscar = '';

  constructor( private mCole: ColesService,
               private mAuth: AuthService,
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
      this.subColes = this.mCole.getColegios()
                        .subscribe(
                          (resp) => {
                            this.colegios = resp;
                            this.filtrar();
                            },
                          (err) => console.log( err ),
                          () => {}
                        );
    } else {
      this.subColes = this.mCole.getColegiosVendedor( this.mAuth.usuario._id )
                      .subscribe(
                        (resp) => {
                          this.colegios = resp;
                          this.filtrar();
                        },
                        (err) => console.log(err));
    }
  }


  async agregarCole() {
    const agregaModal = await this.modalCtrl.create({
      component: AgregarColePage
    });

    // agregaModal.onDidDismiss().then((data: any) => {
    //   if ( data.data.ok ) {
    //     this.cargarCole();
    //   }
    // });

    await agregaModal.present();

    const { data } = await agregaModal.onDidDismiss();
    if ( data.ok ){
      this.cargarCole();
    }

  }

  async ubicarTodos() {
    const ubicarTodosModal = await this.modalCtrl.create({
      component: UbicarTodosComponent,
      componentProps: {
        colegios: this.colegios
      }
    });

    await ubicarTodosModal.present();

  }

  filtrar() {
    this.colegiosFiltrados = [...this.colegios];
    let temporalNombre = [];
    const busca = this.buscar.toLowerCase();
    if(this.mAuth.usuario.role === 'ADMIN'){

      temporalNombre = this.colegiosFiltrados.filter( resp => {
        if ( resp.nombre.toLowerCase().includes(this.buscar) ||
             resp.localidad.toLowerCase().includes(this.buscar) ||
             resp.codigo.toLowerCase().includes(this.buscar)){

              return resp;
        }
      });

    } else {

      temporalNombre = this.colegiosFiltrados.filter( resp => {
        if ( resp.nombre.toLowerCase().includes(this.buscar) ||
            resp.localidad.toLowerCase().includes(this.buscar)){

              return resp;
        }
      });

    }
    this.colegiosFiltrados = [...temporalNombre];

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
