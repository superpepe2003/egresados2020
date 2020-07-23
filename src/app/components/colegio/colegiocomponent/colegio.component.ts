import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IColegio } from '../../../models/colegio';
import { ColegioPopoverComponent } from '../colegio-popover/colegio-popover.component';
import { PopoverController, ModalController } from '@ionic/angular';
import { ListarComponent } from '../../alumno/listar/listar.component';
import { UbicarComponent } from '../ubicar/ubicar.component';
import { AgregarColePage } from '../agregar/agregar-cole.page';

@Component({
  selector: 'app-colegio',
  templateUrl: './colegio.component.html',
  styleUrls: ['./colegio.component.scss'],
})
export class ColegioComponent implements OnInit {

  @Input() colegio: IColegio;
  @Output() coleActualiza = new EventEmitter();

  url = '';

  constructor( private popoverCtrl: PopoverController,
               private modal: ModalController) { }

  ngOnInit() {
    if ( this.colegio.ubicacion ){
      this.cargaMapa(this.colegio.ubicacion.lat, this.colegio.ubicacion.lng);
    }
  }

  cargaMapa( lat, lng) {
    this.url = `https://maps.google.com/maps?q=${ lat },${ lng }&hl=es;z=14&output=embed`;
  }

  async onMenu( evento, cole) {
    const popover = await this.popoverCtrl.create({
      component: ColegioPopoverComponent,
      event: evento,
      mode: 'ios',
      backdropDismiss: true
    });

    await popover.present();

    // const { data } = await popover.onDidDismiss();
    const { data } = await popover.onWillDismiss();

    console.log('menu: ', data.item);
    switch ( data.item ){
      case 1:
        this.ejecutarModificar( cole );
        break;
      case 2:
        this.ejecutarUbicar( cole );
        break;
      case 3:
        this.ejecutarLista( cole );
        break;
    }
  }

  async ejecutarLista( cole: IColegio){
      const modalLista = await this.modal.create({
        component: ListarComponent,
        componentProps: {
          alumnos: cole.alumnos,
          titulo: `${cole.nombre} - ${cole.localidad}`
        }
      });

      modalLista.present();

      await modalLista.onDidDismiss();

      this.coleActualiza.emit({ ok: true });
  }


  async ejecutarUbicar( cole: IColegio){
      const modalLista = await this.modal.create({
        component: UbicarComponent,
        componentProps: {
          colegio: cole
        }
      });

      modalLista.present();

      const { data } = await modalLista.onDidDismiss();

      if (data.colegio.ubicacion) {
        this.cargaMapa( data.colegio.ubicacion.lat, data.colegio.ubicacion.lng);
      }
  }

  async ejecutarModificar( cole: IColegio){
    const modalLista = await this.modal.create({
      component: AgregarColePage,
      componentProps: {
        colegio: cole,
        isModificar: true
      }
    });

    modalLista.present();

    const { data } = await modalLista.onDidDismiss();

    if ( data.colegio ){
      this.colegio = {...data.colegio};
      console.log(this.colegio);
    }
}



}
