import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IUsuario } from '../../../models/usuario';
import { AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ColesService } from '../../../services/coles.service';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.scss'],
})
export class AlumnoComponent implements OnInit, OnDestroy {

  @Input() alumno: IUsuario;
  @Input() isVendedor;
  @Output() cambiarCole = new EventEmitter();
  @Output() eliminar = new EventEmitter();

  subCole: Subscription;

  constructor( private alertCtrl: AlertController,
               private mCol: ColesService) { }

  ngOnInit() {
    console.log(this.alumno);
  }

  async onCambiarCole() {

    let nuevoCodigo = '';
    const input = await this.alertCtrl.create({

      header: 'Cambio de Colegio',
      subHeader: 'Ingrese codigo colegio',
      inputs: [
        {
          name: 'txtCodigo',
          type: 'text',
          placeholder: 'Codigo contrato'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'OK',
          handler: ( data ) => {
            this.updateCole( data.txtCodigo );
          }
        }
      ]

    });

    await input.present();

  }

  updateCole( cod: string ) {
    this.subCole = this.mCol.colegioExisteCod( cod )
              .subscribe(( resp: any ) => {
                  console.log(resp);
                  if ( resp.ok ){
                    this.cambiarCole.emit( {alumno: this.alumno, codigo: cod, colegio: resp.colegio } );
                  }
              });
  }

  onEliminar() {
    console.log('Elimina alumno');
    this.eliminar.emit( this.alumno._id );
  }

  ngOnDestroy() {
    if ( this.subCole ){
      this.subCole.unsubscribe();
    }
  }

}
