import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IColegio } from '../../../models/colegio';
import { IMarcador } from '../mapaubicar/mapa-ubicar.component';
import { Subscription } from 'rxjs';
import { ColegiosService } from '../../../services/colegios.service';

@Component({
  selector: 'app-ubicar',
  templateUrl: './ubicar.component.html',
  styleUrls: ['./ubicar.component.scss'],
})
export class UbicarComponent implements OnInit, OnDestroy {

  @Input() colegio: IColegio;

  subLocalidad: Subscription;
  localidad = '';

  ubicacion: IMarcador = {
    lat: -34.603722,
    lng: -58.381592 };

  constructor( private modalCtrl: ModalController,
               private mCole: ColegiosService) { }

  ngOnInit() {}

  salir(){
    this.modalCtrl.dismiss();
  }

  ubicado(e){
    this.colegio.ubicacion = { lat: e.lat, lng: e.lng };
    this.subLocalidad = this.mCole.updateColegio( this.colegio )
              .subscribe( resp => {
                this.modalCtrl.dismiss( { colegio: this.colegio } );
              });
  }

  UbicaLocalidad( ) {

    this.subLocalidad = this.mCole.ubicaLocalidad( this.localidad )
            .subscribe( resp => {
              if ( resp ){
                 this.ubicacion = { lat: resp.lat, lng: resp.lon };
              }
            });

  }

  ngOnDestroy() {
    if (this.subLocalidad){
      this.subLocalidad.unsubscribe();
    }
  }

}
