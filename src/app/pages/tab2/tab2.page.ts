import { Component, OnDestroy } from '@angular/core';
import { ColegiosService } from '../../services/colegios.service';
import { OAuthServiceService } from '../../services/o-auth-service.service';
import { IColegio } from '../../models/colegio';
import { Subscription } from 'rxjs';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { AgregarColePage } from '../../components/colegio/agregar/agregar-cole.page';
import { RouteConfigLoadEnd } from '@angular/router';
import { UbicarTodosComponent } from '../../components/colegio/ubicar-todos/ubicar-todos.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnDestroy{

  colegios: IColegio[];
  subColes: Subscription;

  constructor( private mCole: ColegiosService,
               private mAuth: OAuthServiceService,
               private modalCtrl: ModalController,
               public actionSheetController: ActionSheetController) {

  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter');
    this.cargarCole();
  }

  cargarCole(){
    if ( this.mAuth.usuario.role === 'ADMIN' ){
      this.subColes = this.mCole.getColegios()
                      .subscribe( (resp: any) => {
                        if ( resp.ok ){
                          this.colegios = resp.colegios;
                        }
                      });
    } else {
      this.subColes = this.mCole.getColegiosVendedor( this.mAuth.usuario._id )
                      .subscribe( (resp: any) => {
                        if ( resp.ok ){
                          console.log(resp);
                          this.colegios = resp.colegios;
                        }
                      });
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

  async presentAction() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Colegios',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Agregar',
        icon: 'add',
        handler: () => {
          this.agregarCole();
        }
      }, {
        text: 'Ubicaciones',
        icon: 'map',
        handler: () => {
          this.ubicarTodos();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  ngOnDestroy() {
    if ( this.subColes ) {
      this.subColes.unsubscribe();
    }
  }

}
