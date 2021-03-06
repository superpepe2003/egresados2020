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
  @Output() cambiarCurso = new EventEmitter();
  @Output() eliminar = new EventEmitter();

  subCole: Subscription;

  constructor( private alertCtrl: AlertController,
               private mCol: ColesService) { }

  ngOnInit() {
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
            this.updateCurso( data.txtCodigo );
          }
        }
      ]

    });

    await input.present();

  }

  updateCurso( cod: string ) {
    this.subCole = this.mCol.cursoExisteCod( cod )
              .subscribe(( resp: any ) => {
                  if ( resp ){
                    this.cambiarCurso.emit( {alumno: this.alumno, codigo: cod, curso: resp.curso } );
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
